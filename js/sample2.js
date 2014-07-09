// サイズ
var margin = {top : 1, right : 1, bottom : 6, left : 1};
var width  = 960 - margin.left - margin.right;
var height = 500 - margin.top  - margin.bottom;

// 数字のフォーマット
var formatNumber = d3.format(",.0f");
var format = function(d) { return formatNumber(d) + ""; };
var color  = d3.scale.category20();

// SVG画像
var svg = d3.select('#diagram')
    .append('svg')
    .attr('width' , width  + margin.left + margin.right )
    .attr('height', height + margin.top  + margin.bottom )
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// sankey初期化
var sankey = d3.sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .size([width, height]);

var path = sankey.link();

var data = { 
    name : "root",
    children : [
        {
            name : "node1",
            children : [ { name : "node3", value : 3 }, { name : "node4", value : 1 } ],
            value : 1
        },
        { 
            name : "node2",
            children : [ { name : "node1", value : 2 }, { name : "node2", value : 1 } ],
            value : 1
        },
        {
            name : "node3",
            children : [
                {
                    name : "node6",
                    children : [ { name : "node4", value : 2 } ],
                    value : 1
                } 
            ],
            value : 1
        }
    ]
};

var cluster = d3.layout.cluster();
var nodes   = cluster.nodes(data);
var links   = cluster.links(nodes);

for(var i = 0; i < links.length; i++) {
    links[i].value = links[i].target.value;
}

// データバインド
sankey.nodes(nodes)
        .links(links)
        .layout(32);

var link = svg.append('g').selectAll('.link')
        .data(links)
        .enter()
        .append('path')
        .attr({
            'class' : 'link',
            'd'     : path
        })
        .style('stroke-width', function(d){ return Math.max(1, d.dy); })
        .sort(function(a, b) { return b.dy - a.dy });



// リンクのタイトル追加
link.append('title')
    .text(function(d) { return d.source.name + ' --> ' + d.target.name + "\n" + format(d.value); });

// ノード追加
var node = svg.append('g').selectAll('.node')
        .data(nodes)
        .enter()
        .append('g')
        .attr({
            'class'     : 'node',
            'transform' : function(d) { return 'translate(' + d.x + ',' + d.y + ')'; }
        })
        .call(d3.behavior.drag()
            .origin(function(d) { return d; })
            .on('dragstart', function() { this.parentNode.appendChild(this); })
            .on('drag', dragMove)
        );

// rect追加
node.append('rect')
    .attr({
        'height' : function(d) { return d.dy; },
        'width'  : sankey.nodeWidth()
    })
    .style({
        'fill'   : function(d) { return d.color = color(d.name.replace(/ .*/, '')); },
        'stroke' : function(d) { return d3.rgb(d.color).darker(2); }
    })
    .append('title')
    .text(function(d){ return d.name + "\n" + format(d.value); });

// nodeにテキスト追加
node.append('text')
    .attr({
        'x'  : -6,
        'y'  : function(d) { return d.dy / 2; },
        'dy' : '.35em',
        'text-anchor' : 'end',
        'transform'   : null
    })
    .text(function(d)   { return d.name; })
    .filter(function(d) { return d.x < width / 2; }) // 全体の幅の半分より左側の場合
    .attr({
        'x' : 6 + sankey.nodeWidth(),
        'text-anchor' : 'start'
    });

// rectを動かすためのfunction 
function dragMove(d) {
    d3.select(this).attr('transform', 'translate(' + d.x + ',' + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ')');
    sankey.relayout();
    link.attr('d',path);
}
