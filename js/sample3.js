// サイズ
var margin = {top : 1, right : 1, bottom : 6, left : 1};
var width  = 960 - margin.left - margin.right;
var height = 500 - margin.top  - margin.bottom;

// 数字のフォーマット
var formatNumber = d3.format(",.0f");
var format = function(d) { return formatNumber(d) + ""; };

var svg = d3.select('#diagram')
        .append('svg')
        .attr('viewBox', "-100, -100, 200, 200");

var data = [
    [1, 2, 3, 4],
    [2, 3, 4, 5],
    [1, 3, 5, 7],
    [2, 3, 4, 5]
];

var color = ["red", "orange", "#0F0", "blue"];

var chord = d3.layout.chord()
        .padding(0.1)
        .matrix(data);

console.log(chord.groups());
console.log(chord.chords());

// グループ
var groups = svg.selectAll('path.groups')
    .data(chord.groups)
    .enter()
    .append('path')
    .style('fill', function(d) { return color[d.index]; } )
    .style('stroke', function(d) { return color[d.index]; } )
    .attr('d', d3.svg.arc().innerRadius(90).outerRadius(100));

// グループにタイトルつける
// groups.append('text')
//     .attr({
//           'x' : 5
//         , 'y' : function(d) { return (d.startAngle + d.endAngle) / 2; }
//         , 'dy' : '.35em'
//         , 'text-anchor' : 'start'
//         , 'transform' : null
//     }).text( function(d){ return d.index; } );

// 相関
var chords = svg.selectAll('path.chord')
    .data(chord.chords)
    .enter()
    .append('path')
    .style('fill', function(d) { return color[d.source.index]; } )
    .attr('d', d3.svg.chord().radius(90))
    .style('opacity', 0.5);

// 相関にタイトル
chords.append('title')
    .text(function(d) {
        var s_index = d.source.index;
        var t_index = d.target.index;
        var value   = data[s_index][t_index];
        return s_index + '-->' + t_index + ':' + value;
    });