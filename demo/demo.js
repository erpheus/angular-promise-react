/* Code obtained from angularjs homepage https://angularjs.org/. Licensed with CC 3.0 
    http://creativecommons.org/licenses/by/3.0/
*/
angular.module('angular-example', [])

  .config(function($provide, $locationProvider) {
    var pulseElements = $(),
        pulseColor = {r:0xE6, g:0xF0, b: 0xFF},
        baseColor = {r:0x99, g:0xc2, b: 0xFF},
        pulseDuration = 1000,
        pulseDelay = 15000;

    function hex(number) {
      return ('0' + Number(number).toString(16)).slice(-2);
    }

    /*jQuery.fn.pulse = function () {
      pulseElements = pulseElements.add(this);
    };*/
    var lastPulse;

    function tick() {
      var duration = new Date().getTime() - lastPulse,
          index = duration * Math.PI / pulseDuration ,
          level = Math.pow(Math.sin(index), 10),
          color = {
            r: Math.round(pulseColor.r * level + baseColor.r * (1 - level)),
            g: Math.round(pulseColor.g * level + baseColor.g * (1 - level)),
            b: Math.round(pulseColor.b * level + baseColor.b * (1 - level))
          },
          style = '#' + hex(color.r) + hex(color.g) + hex(color.b);

      pulseElements.css('backgroundColor', style);
      if (duration > pulseDuration) {
        setTimeout(function() {
          lastPulse = new Date().getTime();
          tick();
        }, pulseDelay);
      } else {
        setTimeout(tick, 50);
      }
    }

    $provide.value('startPulse', function() {
       setTimeout(function() {
         lastPulse = new Date().getTime();
         tick();
       }, 2000);
    });

    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
  })

  .value('indent', function(text, spaces) {
    if (!text) return text;
    var lines = text.split(/\r?\n/);
    var prefix = '      '.substr(0, spaces || 0);
    var i;

    // remove any leading blank lines
    while (lines.length && lines[0].match(/^\s*$/)) lines.shift();
    // remove any trailing blank lines
    while (lines.length && lines[lines.length - 1].match(/^\s*$/)) lines.pop();
    var minIndent = 999;
    for (i = 0; i < lines.length; i++) {
      var line = lines[0];
      var indent = line.match(/^\s*/)[0];
      if (indent !== line && indent.length < minIndent) {
        minIndent = indent.length;
      }
    }

    for (i = 0; i < lines.length; i++) {
      lines[i] = prefix + lines[i].substring(minIndent);
    }
    lines.push('');
    return lines.join('\n');
  })

  .value('escape', function(text) {
    return text.replace(/\&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  })

  .factory('fetchCode', function(indent) {
    return function get(id, spaces) {
      return indent(angular.element(document.getElementById(id)).html(), spaces);
    };
  })

  .directive('code', function() {
    return {restrict: 'E', terminal: true};
  })

  .directive('appRun', function(fetchCode, $templateCache, $browser) {
    return {
      terminal: true,
      link: function(scope, element, attrs) {
        var modules = [];

        modules.push(function($provide, $locationProvider) {
          $provide.value('$templateCache', {
            get: function(key) {
              var value = $templateCache.get(key);
              if (value) {
                value = value.replace(/\#\//mg, '/');
              }
              return value;
            },
            put: function(key, value) {
              // noop, we don't need the cache for anything in examples
            }
          });
          $provide.value('$anchorScroll', angular.noop);
          $provide.value('$browser', $browser);
          $locationProvider.html5Mode(true);
          $locationProvider.hashPrefix('!');
        });
        if (attrs.module) {
          modules.push(attrs.module);
        }

        element.html(fetchCode(attrs.appRun));
        element.bind('click', function(event) {
          if (event.target.attributes.getNamedItem('ng-click')) {
            event.preventDefault();
          }
        });
        element.data('$injector', null);
        angular.bootstrap(element, modules);
      }
    };
  })

  .factory('script', function() {

    return {
      angular: '<script src="https://ajax.googleapis.com/ajax/libs/angularjs/' + angular.version.full + '/angular.min.js"></script>\n',
      resource: '<script src="https://ajax.googleapis.com/ajax/libs/angularjs/' + angular.version.full + '/angular-resource.min.js"></script>\n',
      route: '<script src="https://ajax.googleapis.com/ajax/libs/angularjs/' + angular.version.full + '/angular-route.min.js"></script>\n',
      firebase: '<script src="https://cdn.firebase.com/js/client/2.0.4/firebase.js"></script>\n    <script src="https://cdn.firebase.com/libs/angularfire/0.9.0/angularfire.min.js"></script>\n'
    };
  })

  .directive('appSource', function(fetchCode, escape, script, $compile, $timeout) {
    return {
      terminal: true,
      scope: true,
      link: function(scope, element, attrs) {
        var tabs = [],
            annotation = attrs.annotate && angular.fromJson(fetchCode(attrs.annotate)) || {},
            TEMPLATE = {
              'index.html':
                '<!doctype html>\n' +
                '<html ng-app__MODULE__>\n' +
                '  <head>\n' +
                '    ' + script.angular +
               (attrs.resource ? ('    ' + script.resource.replace('></', '>\n    </')) : '') +
               (attrs.route ? ('    ' + script.route.replace('></', '>\n   </')) : '') +
               (attrs.firebase ? ('    ' + script.firebase) : '') +
                '__HEAD__' +
                '  </head>\n' +
                '  <body>\n' +
                '__BODY__' +
                '  </body>\n' +
                '</html>'
          };

        if (attrs.clean !== undefined){
          TEMPLATE['index.html'] = '__BODY__';
        }

        element.css('clear', 'both');

        angular.forEach(attrs.appSource.split(' '), function(filename, index) {
          var content;

          if (index === 0) {
            var head = [];

            angular.forEach(attrs.appSource.split(' '), function(tab, index) {
              var filename = tab.split(':')[0],
                  fileType = filename.split(/\./)[1];

              if (index === 0) return;
              if (fileType == 'js') {
                head.push('    <script src="' + filename + '"></script>\n');
              } else if (fileType == 'css') {
                head.push('    <link rel="stylesheet" href="' + filename + '">\n');
              }
            });
            content = TEMPLATE['index.html'];
            content = content.
              replace('__MODULE__', attrs.module ? '="' + attrs.module + '"' : '').
              replace('__HEAD__', head.join('')).
              replace('__BODY__', fetchCode(filename, 4));
          } else {
            content = fetchCode(filename);
          }

          // hack around incorrect tokenization
          content = content.replace('.done-true', 'doneTrue');
          content = prettyPrintOne(escape(content), undefined, true);
          // hack around incorrect tokenization
          content = content.replace('doneTrue', '.done-true');

          var popovers = {},
              counter = 0;

          angular.forEach(annotation[filename], function(text, key) {

            text = text.replace('{{', '&#123;&#123;').replace('}}', '&#125;&#125;');

            var regexp = new RegExp('(\\W|^)(' + key.replace(/([\W\-])/g, '\\$1') + ')(\\W|$)');

            content = content.replace(regexp, function(_, before, token, after) {
              token = "__" + (counter++) + "__";
              popovers[token] =
                '<span class="nocode"\n' +
                '      popover-title="' + escape(key) + '"\n' +
                '      popover-trigger="click"\n' +
                '      popover-append-to-body="true"\n' +
                '      popover-html-unsafe="' + escape(text) + '"><code>' + escape(key) + '</code>' +
                '</span>';
              return before + token + after;
            });
          });

          angular.forEach(popovers, function(text, token) {
            content = content.replace(token, text);
          });

          tabs.push(
            '<tab heading="' + (index ? filename : 'index.html')  + '">\n' +
            '  <pre class="prettyprint linenums nocode"><code>' + content +'</code></pre>\n' +
            '</tab>\n'
          );
        });

        element.html(
          '<tabset>' +
            tabs.join('') +
          '</tabset>');
        // element.find('[rel=popover]').popover().pulse();

        // Compile up the HTML to get the directives to kick-in
        $compile(element.children())(scope);
        $timeout(function() {
          var annotationElements = element.find('span[popover-html-unsafe]');
          $compile(annotationElements)(scope);
        }, 0);
      }
    };
  })

  .directive('jsFiddle', function(fetchCode, escape, script) {
    return {
      terminal: true,
      link: function(scope, element, attr) {
        var name = '',
            stylesheet = '<link rel="stylesheet" href="http://netdna.bootstrapcdn.com/twitter-bootstrap/2.0.4/css/bootstrap-combined.min.css">\n',
            fields = {
              html: '',
              css: '',
              js: ''
            };

        angular.forEach(attr.jsFiddle.split(' '), function(file, index) {
          var fileType = file.split('.')[1];

          if (fileType == 'html') {
            if (index === 0) {
              fields[fileType] +=
                  '<div ng-app' + (attr.module ? '="' + attr.module + '"' : '') + '>\n' +
                    fetchCode(file, 2);
            } else {
              fields[fileType] += '\n\n\n  <!-- CACHE FILE: ' + file + ' -->\n' +
                  '  <script type="text/ng-template" id="' + file + '">\n' +
                      fetchCode(file, 4) +
                  '  </script>\n';
            }
          } else {
            fields[fileType] += fetchCode(file) + '\n';
          }
        });

        fields.html += '</div>\n';

        element.html(
          '<form class="jsfiddle" method="post" action="https://jsfiddle.net/api/post/library/pure/" target="_blank">' +
            hiddenField('title', 'AngularJS Example: ' + name) +
            hiddenField('css', '</style> <!-- Ugly Hack due to jsFiddle issue: http://goo.gl/BUfGZ --> \n' +
               stylesheet +
               script.angular +
               (attr.resource ? script.resource : '') +
               (attr.route ? script.route : '') +
               (attr.firebase ? script.firebase : '') +
               '<style>\n' +
               fields.css) +
            hiddenField('html', fields.html) +
            hiddenField('js', fields.js) +
            '<button class="btn btn-primary">' +
              '<i class="icon-white icon-pencil"></i> ' +
              'Edit Me' +
            '</button>' +
          '</form>');

        function hiddenField(name, value) {
          return '<input type="hidden" name="' +  name + '" value="' + escape(value) + '">';
        }
      }
    };
  })


.run(function($rootScope){
  //$rootScope.version = angular.version;

  //   $('[rel=popover]').
  //     popover().
  //     pulse();
  //   startPulse();
  // });

});

