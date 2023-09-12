import { CSS2DRenderer, CSS2DObject } from '//unpkg.com/three/examples/jsm/renderers/CSS2DRenderer.js';

const element = document.getElementById('graph');

const Graph = ForceGraph3D({
        extraRenderers: [new CSS2DRenderer()]
    })(element)
    .jsonUrl('graph.json')
    .backgroundColor('#00356b')
    .nodeColor(node => node.title ? 'green' : 'yellow')
    .nodeLabel(node => node.name || node.title)
    /*
    .nodeThreeObject(node => {
        const nodeEl = document.createElement('div');
        nodeEl.textContent = node.name || node.title;
        nodeEl.style.color = node.color;
        nodeEl.className = 'node-label';
        return new CSS2DObject(nodeEl);
    })
    .nodeThreeObjectExtend(true)
    */
    .onNodeClick(node => {
        if (node.title) {
            window.open(`https://collegearts.yale.edu/events/shows-screenings/${node.slug}`, '_blank');
        } else {
            window.open(`https://collegearts.yale.edu/biography/${node.slug}`, '_blank');
        }
    });
