module.exports = function(grunt) {
	"use strict";
	
	var packageObj = grunt.file.readJSON('package.json')

	var banner = function() {
		var date = new Date,
			h = date.getHours(),
			m = date.getMinutes(),
			s = date.getSeconds();
			
		h = h<10 ? '0'+h : h;
		m = m<10 ? '0'+m : m;
		s = s<10 ? '0'+s : s;
		
		var time = h + ':' + m + ':' + s;
		
		var str = '/*!\n';
		str += ' * <%= pkg.name %>.js v<%= pkg.version %>\n';
		str += ' * ' + packageObj.descrition + '\n';
		str += ' * <%= pkg.author %> <%= grunt.template.today("yyyy-mm-dd") %> ' + time + '\n';
		str += ' *\n'
		str += ' */\n';
		
		return str;
	}();
	
	// 配置
	grunt.initConfig({
		pkg: packageObj,
		concat: {
			options: {
				banner: banner
			},
			clazz: {
				// intro在首部，outro在尾部
				src: ['src/intro.js', 'src/event.js', 'src/class.js', 'src/outro.js'],
				dest: 'class.src.js'
			}
		},
		uglify: {
			options: {
				banner: banner
			},
			build: {
				src: ['class.src.js'],
				dest: 'class.js'
			}
		}
	});
	
	
	// 载入concat和uglify插件，分别对于合并和压缩
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	
	// 注册任务
	grunt.registerTask('default', ['concat', 'uglify']);
}; 