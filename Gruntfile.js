module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.initConfig({
        sass: {
            dist: {
                options: {
                    style: "compressed",
                },
                files: [{
                    expand: true,
                    cwd: "circle_suck/static/sass",
                    src: "**/*.scss",
                    dest: "circle_suck/static/css",
                    ext: ".css",
                }]
            }
        },
        watch: {
            sass: {
                files: "circle_suck/static/sass/**/*.scss",
                tasks: "sass",
            }
        }
    });

    grunt.registerTask("build", ["sass"]);
    grunt.registerTask("default", ["build", "watch"]);
};
