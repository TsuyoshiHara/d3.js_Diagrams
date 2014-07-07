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

d3.json("../data/input.json", function(input){
// d3.json("../model/dataGenerator.php", function(input){

    // データバインド
    sankey
        .nodes(input.nodes)
        .links(input.links)
        .layout(32);

    // リンク追加
    var link = svg.append('g').selectAll('.link')
            .data(input.links)
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('d', path)
            .style('stroke-width', function(d){ return Math.max(1, d.dy); })
            .sort(function(a, b) { return b.dy - a.dy });

    // リンクのタイトル追加
    link.append('title')
        .text(function(d) { return d.source.name + ' → ' + d.target.name + "\n" + format(d.value); });

    // ノード追加
    var node = svg.append('g').selectAll('.node')
            .data(input.nodes)
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
            .call(d3.behavior.drag()
                .origin(function(d) { return d; })
                .on('dragstart', function() { this.parentNode.appendChild(this); })
                .on('drag', dragMove)
            );

    // rect追加
    node.append('rect')
        .attr('height', function(d) { return d.dy; })
        .attr('width', sankey.nodeWidth())
        .style('fill', function(d) { return d.color = color(d.name.replace(/ .*/, '')); })
        .style('stroke', function(d) { return d3.rgb(d.color).darker(2); })
        .append('title')
        .text(function(d){ return d.name + "\n" + format(d.value); });

    // nodeにテキスト追加
    node.append('text')
        .attr('x' , -6)
        .attr('y' , function(d) { return d.dy / 2; })
        .attr('dy', '.35em')
        .attr('text-anchor', 'end')
        .attr('transform'  , null)
        .text(function(d)   { return d.name; })
        .filter(function(d) { return d.x < width / 2; }) // 全体の幅の半分より左側の場合
        .attr('x', 6 + sankey.nodeWidth())
        .attr('text-anchor', 'start');

    // rectを動かすためのfunction 
    function dragMove(d) {
        d3.select(this).attr('transform', 'translate(' + d.x + ',' + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ')');
        sankey.relayout();
        link.attr('d',path);
    }

});