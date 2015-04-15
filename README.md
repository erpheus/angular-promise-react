# angular-promise-react

[![Build Status](https://travis-ci.org/erpheus/angular-promise-react.svg?branch=master)](https://travis-ci.org/erpheus/angular-promise-react)

Angular directive for buttons or links that trigger a deferred call and display status and outcome in the button itself.

## How to use

### Installation

Install it via bower:

	$ bower install angular-promise-react --save


or download the [minified source](https://github.com/erpheus/angular-promise-react/releases/latest) from github.

Include angular-promise-react0s script tag after angularjs's one:

```html
<script type="text/javascript" src="angular-promise-react/angular-promise-react.js"></script>
```

Inject `promise-react` directive into your angular module:

```javascript
angular.module('myApp', ['promise-react'])
```

### Basic usage

Full documentation and examples [in here](http://erpheus.github.io/angular-promise-react)

```html
<a promise-button="deferredAction()">
	Current status: {{status}}
	<span when-promise="idle"> Initial text </span>
    <span when-promise="loading"> Loading... </span>
    <span when-promise="intermediate"> Received notification containing {{state}} </span>
    <span when-promise="done">Finished correctly with result: {{state}}</span>
    <span when-promise="failed">Completed with error: {{state}}</span>
    <span when-promise>I show whenever the button is not idle</span>
    <br>
    <span when-progress="50">Action is halfway</span>
    <span when-progress>Action has started and has not finished (loading or intermediate)</span>
</a>
```


```html
<a promise-button="deferredAction()" promise-trigger="dblclick">
	<promise-default>
		Default button label
	</promise-default>
</a>
```


## License
Licensed under the terms of the [Apache license 2.0](https://github.com/erpheus/angular-promise-react/blob/master/LICENSE)
