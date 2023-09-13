const element = document.getElementById('graph');

function graphYCA() {
    const Graph = ForceGraph3D()(element)
        //.jsonUrl('graph.json')
        .jsonUrl('graph.json')
        .backgroundColor('#00356b')
        .nodeColor(node => node.title ? 'green' : 'yellow')
        .nodeLabel(node => node.name || node.title)
        .onNodeClick(node => {
            if (node.title) {
                window.open(`https://collegearts.yale.edu/events/shows-screenings/${node.slug}`, '_blank');
            } else {
                window.open(`https://collegearts.yale.edu/biography/${node.slug}`, '_blank');
            }
        });
}

function graphYDN() {
    const Graph = ForceGraph3D()(element)
        //.jsonUrl('graph.json')
        .jsonUrl('ydn_graph.json')
        .backgroundColor('#00356b')
        //.nodeColor(node => node.url ? 'green' : 'yellow')
        .nodeAutoColorBy('category')
        .nodeRelSize(node.url ? 4 : 8)
        .nodeLabel(node => node.name || node.title)
        .onNodeClick(node => {
            if (node.title) {
                window.open(`https://collegearts.yale.edu/events/shows-screenings/${node.slug}`, '_blank');
            } else {
                window.open(`https://collegearts.yale.edu/biography/${node.slug}`, '_blank');
            }
        });
}

graphYCA();

document.getElementById('yca_button').onclick = graphYCA;
document.getElementById('ydn_button').onclick = graphYDN;
