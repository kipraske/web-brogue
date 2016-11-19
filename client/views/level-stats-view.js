define([
    "jquery",
    "underscore",
    "backbone",
    "chart"
], function ($, _, Backbone, Chart) {

    var LevelStatisticsView = Backbone.View.extend({

        el: '#level-statistics',
        headingTemplate: _.template($('#level-statistics-template').html()),

        initialize: function() {
            this.listenTo(this.model, "add", this.render);
            this.listenTo(this.model, "change", this.render);

            this.grid = new Backgrid.Grid({
                columns: [
                    {
                        name: "level",
                        label: "Level",
                        cell: "integer",
                        sortable: false,
                        editable: false
                    }, {
                        name: "frequency",
                        label: "Frequency",
                        cell: "integer",
                        sortable: false,
                        editable: false
                    }],

                collection: this.model
            });

            this.refresh();
        },

        render: function() {

            this.$el.html(this.headingTemplate({}));

            $("#level-stats-grid").append(this.grid.render().$el);

            //Level statistics chart

            var ctx = document.getElementById("level-statistics-chart");
            var levelData = this.model.pluck("level");
            var frequencyData = this.model.pluck("frequency");

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: levelData,
                    datasets: [{
                        label: '# of deaths',
                        data: frequencyData,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: 'Deaths by level'
                    },
                    scales: {
                        xAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Level'
                            }
                        }],
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Frequency'
                            },
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
            });

            return this;
        },

        refresh: function() {
            this.model.fetch();
            this.render();
        }
    });

    return LevelStatisticsView;
});

