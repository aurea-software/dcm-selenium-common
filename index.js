// DCM extension for selenium wd.
var Q = require('q');

module.exports = function (wd) {
  var url;

  // inits browser
  wd.PromiseChainWebdriver.prototype.dcmInit = function (options) {
    var self = this;
    var deferred = Q.defer();

    this.on('status', function(info) {
      console.log(info);
    });

    this.on('command', function(meth, path, data) {
      console.log(' > ' + meth, path, data || '');
    });

    var max = 10;
    function init(i) {
      Q.timeout(self.init(options), 5000)
        .then(function() {
          console.log('DCM: browser initialized successfully!');
          deferred.resolve();
        })
        .catch(function (error) {
          if (i == 0) {
            return deferred.reject(new Error("DCM: could not initialize browser, " + max + " attempts were made."));
          }

          console.log('DCM: browser init error - ' + error.message + '. Trying again.');
          init(i - 1);
        })
        .done();
    }

    init(max);

    return deferred.promise;
  };

  // loads DCM application
  wd.PromiseChainWebdriver.prototype.dcm = function (options) {
    url = options.url;

    return this
      .get(url);
  };

  // logins to the DCM main application
  wd.PromiseChainWebdriver.prototype.dcmLogin = function (username, password) {
    return this
      .elementByCss('form[name=LoginForm] input[name=LOGINNAME]').type(username)
      .elementByCss('form[name=LoginForm] input[name=PASSWORD]').type(password)
      .elementByCss('form[name=LoginForm] button[type=submit]').click();
  };

  // goes to the Party tab
  wd.PromiseChainWebdriver.prototype.dcmPartyTab = function() {
    return this
      .frame('navbar')
      .elementById('Party').click();
  };

  // goes to the sidenav
  wd.PromiseChainWebdriver.prototype.dcmSidebar = function() {
    return this
      .frame()
      .frame('sidebar');
  };

  // selects Party main frame
  wd.PromiseChainWebdriver.prototype.dcmPersonPartyPage = function () {
    return this
      .frame()
      .frame('container')
      .frame('cacheframe0')
      .frame('subpage');
  };

  // selects Party components frame
  wd.PromiseChainWebdriver.prototype.dcmPersonPartyComponentsPage = function () {
    return this
      .dcmPersonPartyPage()
      .frame('component_iframe');
  };

  // selects Party main frame
  wd.PromiseChainWebdriver.prototype.dcmNewPersonPartyPage = function () {
    return this
      .dcmPersonPartyPage()
      .elementById('Button_Person_Main_NewPerson').click()
      .frame()
      .frame('container')
      .frame('cacheframe0')
      .frame('proppage');
  };

  // selects any button
  wd.PromiseChainWebdriver.prototype.dcmSelectButton = function (containerCss) {
    var selector = containerCss ? containerCss + ' .btn' : '.btn';
    return this
      .elementByCss(selector);
  };

  // selects disabled button
  wd.PromiseChainWebdriver.prototype.dcmSelectDisabledButton = function () {
    return this
      .elementByCss('.btn.pass');
  };

  // selects green button
  wd.PromiseChainWebdriver.prototype.dcmSelectGreenButton = function () {
    return this
      .elementByCss('.btn.btn-green:not(.pass)');
  };

  // selects grey button
  wd.PromiseChainWebdriver.prototype.dcmSelectGreyButton = function () {
    return this
      .elementByCss('.btn.btn-grey:not(.pass)');
  };

  // selects blue button
  wd.PromiseChainWebdriver.prototype.dcmSelectBlueButton = function () {
    return this
      .elementByCss('.btn.btn-blue:not(.pass)');
  };

  // selects red button
  wd.PromiseChainWebdriver.prototype.dcmSelectRedButton = function () {
    return this
      .elementByCss('.btn.btn-red:not(.pass)');
  };

  // selects panel
  wd.PromiseChainWebdriver.prototype.dcmSelectPanel = function () {
    return this
      .elementByCss('.panel');
  };

  // selects table summary
  wd.PromiseChainWebdriver.prototype.dcmSelectTableSummary = function (childCss) {
    var selector = childCss ? '.table-heading ' + childCss : '.table-heading';
    return this
      .elementByCss(selector);
  };

  // selects table
  wd.PromiseChainWebdriver.prototype.dcmSelectTable = function () {
    return this
      .elementByCss('table.table');
  };

  // selects table header
  wd.PromiseChainWebdriver.prototype.dcmSelectTableHeader = function () {
    return this
      .elementByCss('table.table th');
  };

  // selects table row
  wd.PromiseChainWebdriver.prototype.dcmSelectTableRow = function () {
    return this
      .elementByCss('table.table tbody tr');
  };

  // selects table cell
  wd.PromiseChainWebdriver.prototype.dcmSelectTableCell = function () {
    return this
      .elementByCss('table.table td');
  };

  // selects table cell bold text
  wd.PromiseChainWebdriver.prototype.dcmSelectTableCellBold = function () {
    return this
      .elementByCss('table.table td strong');
  };

  // selects login form
  wd.PromiseChainWebdriver.prototype.dcmSelectLoginBox = function (childCss) {
    var selector = childCss ? '.login-model ' + childCss : '.login-model';
    return this
      .elementByCss(selector);
  };

  // selects login form
  wd.PromiseChainWebdriver.prototype.dcmSelectLoginForm = function (childCss) {
    var selector = childCss ? 'form[name=LoginForm] ' + childCss : 'form[name=LoginForm]';
    return this
      .elementByCss(selector);
  };

  return wd;
};