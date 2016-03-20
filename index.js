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
      .get(url)
      // set default window size
      .setWindowSize(1280, 800);
  };

  // logins to the DCM main application
  wd.PromiseChainWebdriver.prototype.dcmLogin = function (username, password) {
    return this
      .elementByCss('form[name=LoginForm] input[name=LOGINNAME]').type(username)
      .elementByCss('form[name=LoginForm] input[name=PASSWORD]').type(password)
      .elementByCss('form[name=LoginForm] button[type=submit]').click();
  };

  // selects Home page frame
  wd.PromiseChainWebdriver.prototype.dcmHomePage = function () {
    return this
      .frame()
      .frame('container')
      .frame('nocacheframe')
      .frame('subpage');
  };

  // goes to the sidenav
  wd.PromiseChainWebdriver.prototype.dcmTopnav = function() {
    return this
      .frame()
      .frame('navbar');
  };

  // goes to the Party tab
  wd.PromiseChainWebdriver.prototype.dcmPartyTab = function() {
    return this
      .dcmTopnav()
      .elementById('Party').click();
  };

  // goes to the Hierarchy tab
  wd.PromiseChainWebdriver.prototype.dcmHierarchyTab = function() {
    return this
      .dcmTopnav()
      .elementById('Hierarchy').click();
  };

  // goes to the DCM Admin tab
  wd.PromiseChainWebdriver.prototype.dcmAdminTab = function() {
    return this
      .dcmTopnav()
      .elementById('DCM Admin').click();
  };

  // goes to the Management Tools tab
  wd.PromiseChainWebdriver.prototype.dcmManagementToolsTab = function() {
    return this
      .dcmTopnav()
      .elementById('Management Tools').click();
  };

  // goes to the Management Tools tab
  wd.PromiseChainWebdriver.prototype.dcmCompensationTab = function() {
    return this
      .dcmTopnav()
      .elementById('Compensation Setup').click();
  };

  // goes to the Reports tab
  wd.PromiseChainWebdriver.prototype.dcmReportsTab = function() {
    return this
      .dcmTopnav()
      .elementById('Reports').click();
  };

  // goes to the sidenav
  wd.PromiseChainWebdriver.prototype.dcmSidebar = function() {
    return this
      .frame()
      .frame('sidebar');
  };

  // goes to the Product Search sub menu
  wd.PromiseChainWebdriver.prototype.dcmProductSearchSubmenu = function() {
    return this
      .elementById('ProductHierarchySearch_sub').click();
  };

  // goes to the Product Search sub menu
  wd.PromiseChainWebdriver.prototype.dcmPersonPartyDelegationSubmenu = function() {
    return this
      .elementById('Tab_Person_Main_Delegation_link').click();
  };

  // selects Party main frame
  wd.PromiseChainWebdriver.prototype.dcmPersonPartyPage = function () {
    return this
      .frame()
      .frame('container')
      .frame('cacheframe0')
      .frame('subpage');
  };

  wd.PromiseChainWebdriver.prototype.dcmSelectPersonPartySearch = function (childCss) {
    var selector = childCss ? '.search-container ' + childCss : '.search-container';
    return this
      .elementByCss(selector);
  };

  // searches for Party by Id
  wd.PromiseChainWebdriver.prototype.dcmSearchPersonPartyByTaxId = function (taxid) {
    return this
      .elementByCss('form[name=Search_Person_Main_primaryForm] input[name=Field_Person_Main_TaxID_Search_Value]')
      .type(taxid)
      .elementByLinkText('Search').click();
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

  // selects Party main frame
  wd.PromiseChainWebdriver.prototype.dcmNewPersonPartyDelegatePage = function () {
    return this
      .dcmPersonPartyPage()
      .dcmPersonPartyComponentsPage()
      .elementById('Button_Person_Main_Delegation_Delegates_AddDelegate').click()
      .frame()
      .frame('container')
      .frame('cacheframe0')
      .frame('proppage');
  };

//Button_Person_Main_Delegation_Delegates_AddDelegate

  // selects Hierarchy main frame
  wd.PromiseChainWebdriver.prototype.dcmPartyHierarchyPage = function () {
    return this
      .frame()
      .frame('container')
      .frame('cacheframe1')
      .frame('subpage');
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

  // creates person party
  wd.PromiseChainWebdriver.prototype.dcmCreatePersonParty = function (options) {
    var params = {
      "firstName": options.firstName,
      "lastName": options.lastName,
      "dtccId": options.dtccId,
      "npn": options.npn,
      "syncWithPdb": options.syncWithPdb,
      "taxId": options.taxId,
      "roles": options.roles,
      "street": options.street,
      "city": options.city,
      "zipCode": options.zipCode
    };

    var promise = this
      .dcmPartyTab()
      .dcmNewPersonPartyPage();

    if (params.firstName) {
      promise = promise
        .elementByCss('input[name="Party.FirstName"]').type(params.firstName);
    }
    if (params.lastName) {
      promise = promise
        .elementByCss('input[name="Party.LastName"]').type(params.lastName); 
    }
    if (params.dtccId) {
      promise = promise
        .elementByCss('input[name=DTCCID]').type(params.dtccId); 
    }
    if (params.npn) {
      promise = promise
        .elementByCss('input[name="Party.NPN"]').type(params.npn); 
    }
    if (params.syncWithPdb === true) {
      promise = promise
        .elementByCss('button[data-id=SyncPDB]').click().sleep(150)
        .elementByCss('button[data-id=SyncPDB] ~ .dropdown-menu li:nth-child(2) a').click();
    } else {
      promise = promise
        .elementByCss('button[data-id=SyncPDB]').click().sleep(150)
        .elementByCss('button[data-id=SyncPDB] ~ .dropdown-menu li:nth-child(1) a').click();
    }
    if (params.taxId) {
      promise = promise
        .elementByCss('input[name="Party.TaxID"]').type(params.taxId); 
    }
    if (params.roles) {
      // scroll to the roles
      promise = promise
        .execute('scrollTo(0,300)');

      var i;
      for (i = 0; i < params.roles.length; ++i) {
        var role = params.roles[i];
        if (role === 'contractKitProvider') {
          promise = promise
            .elementByCss('input[name=RoleFINANCIAL_SERVICES] ~ i').click();
        } else if (role === 'employer') {
          promise = promise
            .elementByCss('input[name=RoleEMPLOYER] ~ i').click();
        } else if (role === 'employee') {
          promise = promise
            .elementByCss('input[name=RoleEMPLOYEE] ~ i').click();
        } else if (role === 'distributor') {
          promise = promise
            .elementByCss('input[name=RoleDISTRIBUTOR] ~ i').click();
        }
      }
    }
    if (params.street) {
      promise = promise
        .elementByCss('input[name="ContactPoint.Address.Street1"]').type(params.street); 
    }
    if (params.city) {
      promise = promise
        .elementByCss('input[name="ContactPoint.Address.City"]').type(params.city);
    }
    if (params.zipCode) {
      promise = promise
        .elementByCss('input[name=ZipCode]').type(params.zipCode);
    }

    return promise
      .elementByCss('a#save').click();
  };

  return wd;
};