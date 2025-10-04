export function createBarChart(id, labels, values) {
	// Remove any previous chart
    const graphContainer = document.getElementById(`#${id}`);
    console.log("graphContainer", graphContainer)
	d3.select(graphContainer).selectAll("svg").remove();

	const width = 500;
	const height = 300;
	const margin = { top: 20, right: 30, bottom: 40, left: 40 };

	const svg = d3.select(`#${id}`)
		.append("svg")
		.attr("width", width)
		.attr("height", height);

	const x = d3.scaleBand()
		.domain(labels)
		.range([margin.left, width - margin.right])
		.padding(0.1);

	const y = d3.scaleLinear()
		.domain([0, d3.max(values)])
		.nice()
		.range([height - margin.bottom, margin.top]);

	svg.append("g")
		.attr("fill", "steelblue")
		.selectAll("rect")
		.data(values)
		.join("rect")
		.attr("x", (d, i) => x(labels[i]))
		.attr("y", d => y(d))
		.attr("height", d => y(0) - y(d))
		.attr("width", x.bandwidth());

	svg.append("g")
		.attr("transform", `translate(0,${height - margin.bottom})`)
		.call(d3.axisBottom(x));

	svg.append("g")
		.attr("transform", `translate(${margin.left},0)`)
		.call(d3.axisLeft(y));

    graphContainer.append(svg.node());    
}

export function removeChart(id) {
    const graphContainer = document.getElementById(`#${id}`);
    d3.select(graphContainer).selectAll("svg").remove();
}