var pkgjson = require('./package.json');
 
var config = {
	pkg: pkgjson,
	src: 'src',
	dist: 'dist',
	demo: 'demo',
	prefix: 'promise-button'
}


module.exports = function (grunt) {

	grunt.initConfig({
		config: config,
		pkg: config.pkg,
		bower: grunt.file.readJSON('./.bowerrc'),
		clean: {
			dist: ['<%= config.dist %>'],
			demo: ['<%= config.demo %>/<%= config.pkg.name %>']
		},
		copy: {
			dist: {
				files: [
					{
						expand: true,
						cwd: '<%= config.src %>',
						src: '*.js',
						dest: '<%= config.dist %>'
					}
				]
			},
			'demo-dist': {
				files: [
					{
						expand: true,
						cwd: '<%= config.dist %>',
						src: '**',
						dest: '<%= config.demo %>/<%= config.pkg.name %>'
					}
				]
			},
			'demo-libraries': {
				files: [
					{
						expand: true,
						cwd: '<%= bower.directory %>/angular',
						src: 'angular.js',
						dest: '<%= config.demo %>'
					}
				]
			}

		},
		html2js: {
			options: {
				// custom options, see below
			},
			dist: {
				src: ['<%= config.src %>/**/*.tpl.html'],
				dest: 'dist/<%= config.prefix %>-templates.js'
			}
		}
	});


	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-html2js');


	grunt.registerTask('default', [
		'dist','demo'
	]);
	grunt.registerTask('dist', [
		'clean:dist',
		'copy:dist',
		'html2js:dist'
	]);
	grunt.registerTask('demo', [
		'dist',
		'clean:demo',
		'copy:demo-libraries',
		'copy:demo-dist'
	]);

};