define([
    "jquery",
    "underscore",
    "backbone",
    "chart"
], function ($, _, Backbone, Chart) {

    var LevelProbabilityView = Backbone.View.extend({

        el: '#level-probability',
        headingTemplate: _.template($('#level-probability-template').html()),

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
                        name: "probability",
                        label: "Probability",
                        cell: "number",
                        sortable: false,
                        editable: false
                    }],

                collection: this.model
            });

            this.refresh();
        },

        render: function() {

            this.$el.html(this.headingTemplate({}));

            $("#level-probability-grid").append(this.grid.render().$el);

            //Level probability chart

            var ctx = document.getElementById("level-probability-chart");
            var levelData = this.model.pluck("level");
            var probabilityData = this.model.pluck("probability");

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: levelData,
                    datasets: [{
                        label: 'probability',
                        data: probabilityData,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: 'Death probability by level'
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

    return LevelProbabilityView;
});

