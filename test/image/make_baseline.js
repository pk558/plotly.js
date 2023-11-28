var minimist = require('minimist');
var path = require('path');
var spawn = require('child_process').spawn;

var getMockList = require('./assets/get_mock_list');

/**
 *  Baseline image generation script.
 *
 *  CLI arguments:
 *
 *  1. 'pattern' : glob determining the baseline(s) to be generated
 *
 *  Examples:
 *
 *  Generate or (re-generate) all baselines:
 *
 *      npm run baseline
 *
 *  Generate or (re-generate) the 'contour_nolines' baseline:
 *
 *      npm run baseline -- contour_nolines
 *
 *  Generate or (re-generate) all gl3d baseline:
 *
 *      npm run baseline -- gl3d_*
 *
 *  Generate or (re-generate) baselines using mathjax3:
 *
 *      npm run baseline mathjax3
 *
 *  Generate or (re-generate) baselines using mathjax4:
 *
 *      npm run baseline mathjax4
 *
 */

var argv = minimist(process.argv.slice(2), {});

var allMockList = [];
var mathjaxVersion = 2;
argv._.forEach(function(pattern) {
    if(pattern === 'mathjax3') {
        mathjaxVersion = 3;
    } else if(pattern === 'mathjax4') {
        mathjaxVersion = 4;
    } else {
        var mockList = getMockList(pattern);

        if(mockList.length === 0) {
            throw new Error('No mocks found with pattern ' + pattern);
        }

        allMockList = allMockList.concat(mockList);
    }
});

if(mathjaxVersion >= 3) {
    allMockList = [
        'legend_mathjax_title_and_items',
        'mathjax',
        'parcats_grid_subplots',
        'table_latex_multitrace_scatter',
        'table_plain_birds',
        'table_wrapped_birds',
        'ternary-mathjax'
    ];
}

if(allMockList.length) console.log(allMockList);
console.log('Please wait for the process to complete.');

var p = spawn(
    'python3', [
        path.join('test', 'image', 'make_baseline.py'),
        (mathjaxVersion >= 3 ? 'mathjax' + mathjaxVersion : '') + '= ' + allMockList.join(' ')
    ]
);
try {
    p.stdout.on('data', function(data) {
        console.log(data.toString());
    });
} catch(e) {
    console.error(e.stack);
    p.exit(1);
}
