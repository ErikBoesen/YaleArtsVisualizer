const element = document.getElementById('graph');

const Graph = ForceGraph3D()(element)
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
