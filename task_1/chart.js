async function buildPlot(){
    const data = await d3.json("my_weather_data.json");
    const dateParser = d3.timeParse("%Y-%m-%d");

    var dimension = {
        width: 1000,
        height: 400,
        margin: {
            left: 100,
            right: 30,
            top: 60,
            bottom: 30
        }
    };


    const wrapper = d3.select("#wrapper");
    const svg = wrapper.append("svg").attr("viewBox", [0, 0, dimension.width, dimension.height]);

    const x_scaler = d3.scaleTime()
        .range([dimension.margin.left, dimension.width - dimension.margin.right]);
    const y_scaler = d3.scaleLinear()
        .range([dimension.height - dimension.margin.bottom - dimension.margin.top, dimension.margin.top]);

    const x_label = "Month";
    const y_label = "Temperature";
    const temperatureMin = (d) => d.temperatureMin;
    const temperatureHigh = (d) => d.temperatureHigh;
    const dates = (d) => dateParser(d.date);

    svg
        .append("text")
        .attr("text-anchor", "right")
        .attr(
            "transform",
            `translate(${dimension.margin.left - 60}, ${
                (dimension.height - dimension.margin.top - dimension.margin.bottom + 180) / 2
            }) rotate(-90)`
        )
        .style("font-size", "24px")
        .text(y_label);

    svg
        .append("text")
        .attr("class", "svg_title")
        .attr("x", (dimension.width - dimension.margin.right + dimension.margin.left) / 2)
        .attr("y", dimension.height - dimension.margin.bottom - dimension.margin.top + 60)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .text(x_label);




    const yAxismin = d3.scaleLinear()
        .domain(d3.extent(data,temperatureMin))
        .range([dimension.height-120,120]);

    const yAxismax = d3.scaleLinear()
        .domain(d3.extent(data,temperatureHigh))
        .range([dimension.height-120,120]);

    const xAxis = d3.scaleTime()
        .domain(d3.extent(data,dates))
        .range([120, dimension.width-30]);

    var minimal = d3.line()
        .x(d => xAxis(dates(d)))
        .y(d => yAxismin(temperatureMin(d)));

    var maximal = d3.line()
        .x(d => xAxis(dates(d)))
        .y(d => yAxismax(temperatureHigh(d)));


    x_scaler.domain(d3.extent(data, dates));
    y_scaler.domain(d3.extent(data, temperatureHigh));

    svg.append('path').attr("fill", "none").attr("stroke", "steelblue")
        .attr("stroke-width", 2).attr('d', minimal(data)).attr('stroke', 'green');

    svg.append('path').attr("fill", "none").attr("stroke", "steelblue")
        .attr("stroke-width", 2).attr('d', maximal(data)).attr('stroke', 'black');

    const x_axis = d3.axisBottom()
        .scale(x_scaler);



    const y_axis = d3.axisLeft()
        .scale(y_scaler);


    svg
        .append("g")
        .attr("transform", `translate(0,${dimension.height - dimension.margin.bottom - dimension.margin.top})`)
        .call(x_axis);
    svg
        .append("g")
        .attr("transform", `translate(${dimension.margin.left},0)`)
        .call(y_axis);
}
buildPlot();