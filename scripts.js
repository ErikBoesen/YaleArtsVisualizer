const element = document.getElementById('graph');

const Graph = ForceGraph3D()(element)
    .jsonUrl('graph.json')
    .nodeAutoColorBy('user')
    .nodeLabel(node => node.name || node.title)
    .onNodeClick(node => {
        if (node.title) {
            window.open(`https://collegearts.yale.edu/events/shows-screenings/${node.slug}`, '_blank');
        } else {
            window.open(`https://collegearts.yale.edu/biography/${node.slug}`, '_blank');
        }
    });
