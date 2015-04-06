var pkgjson = require('./package.json');
 
var config = {
	pkg: pkgjson,
	src: 'src',
	dist: 'dist',
	demo: 'demo',
	tmp: 'tmp',
	prefix: 'promise-button'
}


module.exports = function (grunt) {

	grunt.initConfig({
		config: config,
		pkg: config.pkg,
		bower: grunt.file.readJSON('./.bowerrc'),

		clean: {
			dist: ['<%= config.dist %>'],
			demo: ['<%= config.demo %>/<%= config.pkg.name %>'],
			tmp: ['<%= config.tmp %>']
		},

		copy: {
			tmp: {
				files: [
					{
						expand: true,
						cwd: '<%= config.src %>',
						src: ['**/*.js','**/*.tpl.html'],
						dest: '<%= config.tmp %>'
					}
				]
			},
			templates: {
				files: [
					{
						expand: true,
						cwd: '<%= config.src %>',
						src: ['**/*.tpl.html'],
						dest: '<%= config.tmp %>'
					}
				]
			},
			dist: {
				files: [
					{
						expand: true,
						cwd: '<%= config.tmp %>',
						src: ['<%= pkg.name %>.js', '<%= pkg.name %>.min.js'],
						dest: '<%= config.dist %>'
					}
				]
			},
			'demo-dist': {
				files: [
					{
						expand: true,
						cwd: '<%= config.dist %>/',
						src: '<%= pkg.name %>.js',
						dest: '<%= config.demo %>/<%= pkg.name %>'
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

		concat: {
			tmp: {
				src: ['<%= config.tmp %>/<%= config.prefix %>.js','<%= config.tmp %>/**/*.js'],
      			dest: '<%= config.tmp %>/<%= pkg.name %>.js'
			}
		},

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> v<%= pkg.version %> */;',
				preserveComments: false
			},
			tmp: {
				src: '<%= config.tmp %>/<%= pkg.name %>.js',
				dest: '<%= config.tmp %>/<%= pkg.name %>.min.js'
			},
		},
		html2js: {
			options: {
				module: 'promise-button-templates',
				base: 'tmp'
			},
			tmp: {
				src: ['<%= config.tmp %>/**/*.tpl.html'],
				dest: '<%= config.tmp %>/<%= config.prefix %>-templates.js'
			}
		}
	});


	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-html2js');


	grunt.registerTask('default', [
		'dist','demo'
	]);
	grunt.registerTask('dist', [
		'clean:tmp',
		'copy:tmp',
		'html2js:tmp',
		'concat:tmp',
		'uglify:tmp',
		'clean:dist',
		'copy:dist',
		'clean:tmp'
	]);
	grunt.registerTask('demo', [
		'dist',
		'clean:demo',
		'copy:demo-libraries',
		'copy:demo-dist'
	]);
	grunt.registerTask('templates', [
		'copy:templates',
		'html2js:tmp'
	]);

};