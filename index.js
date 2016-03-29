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

  // goes to the Hier - Product Search sub menu
  wd.PromiseChainWebdriver.prototype.dcmProductHierSearchSubmenu = function() {
    return this
      .dcmSidebar()
      .elementById('ProductHierarchySearch_sub').click();
  };

  // goes to the Hier - Comp Hier Search sub menu
  wd.PromiseChainWebdriver.prototype.dcmCompHierSearchSubmenu = function() {
    return this
      .dcmSidebar()
      .elementById('AgrHierarchySearch_sub').click();
  };

  // goes to the Hier - Comp Hier Search - Tree View sub menu
  wd.PromiseChainWebdriver.prototype.dcmCompHierTreeViewSubmenu = function() {
    return this
      .dcmSidebar()
      .elementById('Tab_AgrHierarchySearch_Tree_Main_link').click();
  };

  // goes to the Hier - Comp Hier Search - Root Positions sub menu
  wd.PromiseChainWebdriver.prototype.dcmCompHierRootPositionsSubmenu = function() {
    return this
      .dcmSidebar()
      .elementById('Tab_AgrHierarchySearch_RootPosition_Main_link').click();
  };

  // goes to the Party Delegation sub menu
  wd.PromiseChainWebdriver.prototype.dcmPersonPartyDelegationSubmenu = function() {
    return this
      .dcmSidebar()
      .elementById('Tab_Person_Main_Delegation_link').click();
  };

  // selects Person Party main frame
  wd.PromiseChainWebdriver.prototype.dcmPersonPartyPage = function () {
    var self = this;
    return this
      .frame()
      .frame('container')
      .elementByCss('iframe[src="/DMS/servlet/com.trilogy.fs.dms.uicore.DMSCompoundPageServlet?AppName=DMS.DMS&PAGE=Party.PersonSearch"]')
      .getAttribute('id').then(function (id) {
        console.log('Frame Id: ' + id);
        return self.frame(id);
      })
      .frame('subpage');
  };

  // selects Org Party main frame
  wd.PromiseChainWebdriver.prototype.dcmOrgPartyPage = function () {
    var self = this;
    return this
      .dcmPersonPartyPage()
      .dcmSelectSearch('button[data-toggle=dropdown]').click().sleep(150)
      .dcmSelectSearch('button[data-toggle=dropdown] ~ .dropdown-menu li:nth-child(2) a').click().sleep(150)      
      .frame()
      .frame('container')
      .elementByCss('iframe[src="/DMS/servlet/com.trilogy.fs.dms.uicore.DMSCompoundPageServlet?AppName=DMS.DMS&PAGE=Party.OrgSearch"]')
      .getAttribute('id').then(function (id) {
        console.log('Frame Id: ' + id);
        return self.frame(id);
      })
      .frame('subpage');
  };  

  // selects Party main frame
  wd.PromiseChainWebdriver.prototype.dcmAuditAdminPage = function () {
    var self = this;
    return this
      .frame()
      .frame('container')
      .elementByCss('iframe[src="/DMS/servlet/com.trilogy.fs.dms.uicore.DMSCompoundPageServlet?AppName=DMS.DMS&PAGE=AuditInfo.AuditPage"]')
      .getAttribute('id').then(function (id) {
        console.log('Frame Id: ' + id);
        return self.frame(id);
      })
      .frame('subpage');
  };

  wd.PromiseChainWebdriver.prototype.dcmSelectPersonPartySearch = function (childCss) {
    var selector = childCss ? '.search-container ' + childCss : '.search-container';
    return this
      .elementByCss(selector);
  };

  wd.PromiseChainWebdriver.prototype.dcmSelectSearch = wd.PromiseChainWebdriver.prototype.dcmSelectPersonPartySearch;

  wd.PromiseChainWebdriver.prototype.dcmSelectPersonPartyAdvancedSearch = function (childCss) {
    var selector = childCss ? '.search-container .advanced-form ' + childCss : '.search-container .advanced-form';
    return this
      .elementByCss(selector);
  };

  wd.PromiseChainWebdriver.prototype.dcmOpenPersonPartyAdvancedSearch = function (childCss) {
    return this
      .dcmSelectPersonPartySearch('.btn.advanced-link').click().sleep(500);
  };

  wd.PromiseChainWebdriver.prototype.dcmOpenAdvancedSearch = wd.PromiseChainWebdriver.prototype.dcmOpenPersonPartyAdvancedSearch;

  // searches for Org Party by Id
  wd.PromiseChainWebdriver.prototype.dcmSearchOrgPartyByTaxId = function (taxid) {
    return this
      .elementByCss('form[name=Search_Org_Main_primaryForm] input[name=Field_Org_Main_TaxID_Search_Value]')
      .type(taxid)
      .elementByLinkText('Search').click();
  };

  // searches for Person Party by Id
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

  // opens New Person Party page and selects main property frame
  wd.PromiseChainWebdriver.prototype.dcmNewPersonPartyPage = function () {
    var self = this;
    return this
      .dcmPersonPartyPage()
      .elementById('Button_Person_Main_NewPerson').click()
      .frame()
      .frame('container')
      .elementByCss('iframe[src="/DMS/servlet/com.trilogy.fs.dms.uicore.DMSCompoundPageServlet?AppName=DMS.DMS&PAGE=Party.PersonSearch"]')
      .getAttribute('id').then(function (id) {
        console.log('Frame Id: ' + id);
        return self.frame(id);
      })
      .frame('proppage');
  };

  // opens New Org Party page and selects main property frame
  wd.PromiseChainWebdriver.prototype.dcmNewOrgPartyPage = function () {
    var self = this;
    return this
      .dcmOrgPartyPage()
      .elementById('Button_Org_Main_NewOrg').click()
      .frame()
      .frame('container')
      .elementByCss('iframe[src="/DMS/servlet/com.trilogy.fs.dms.uicore.DMSCompoundPageServlet?AppName=DMS.DMS&PAGE=Party.OrgSearch"]')
      .getAttribute('id').then(function (id) {
        console.log('Frame Id: ' + id);
        return self.frame(id);
      })
      .frame('proppage');
  };

  // opens New Person Delegation page
  wd.PromiseChainWebdriver.prototype.dcmNewPersonPartyDelegatePage = function () {
    var self = this;
    return this
      .dcmPersonPartyDelegationSubmenu()
      .dcmPersonPartyComponentsPage()
      .elementById('Button_Person_Main_Delegation_Delegates_AddDelegate').click()
      .frame()
      .frame('container')
      .elementByCss('iframe[src="/DMS/servlet/com.trilogy.fs.dms.uicore.DMSCompoundPageServlet?AppName=DMS.DMS&PAGE=Party.PersonSearch"]')
      .getAttribute('id').then(function (id) {
        console.log('Frame Id: ' + id);
        return self.frame(id);
      })
      .frame('proppage');
  };

  // selects Party Hierarchy main frame
  wd.PromiseChainWebdriver.prototype.dcmPartyHierarchyPage = function () {
    var self = this;
    return this
      .frame()
      .frame('container')
      .elementByCss('iframe[src="/DMS/servlet/com.trilogy.fs.dms.uicore.DMSCompoundPageServlet?AppName=DMS.DMS&PAGE=HierarchySearch.HierarchySearch"]')
      .getAttribute('id').then(function (id) {
        console.log('Frame Id: ' + id);
        return self.frame(id);
      })
      .frame('subpage');
  };

  // selects Product Hierarchy main frame
  wd.PromiseChainWebdriver.prototype.dcmProductHierarchyPage = function () {
    var self = this;
    return this
      .dcmProductHierSearchSubmenu()
      .frame()
      .frame('container')
      .elementByCss('iframe[src="/DMS/servlet/com.trilogy.fs.dms.uicore.DMSCompoundPageServlet?AppName=DMS.DMS&PAGE=ProductHierarchySearch.ProductHierarchySearch"]')
      .getAttribute('id').then(function (id) {
        console.log('Frame Id: ' + id);
        return self.frame(id);
      })
      .frame('subpage');
  };

  // selects Comp Hier main frame
  wd.PromiseChainWebdriver.prototype.dcmCompHierarchyPage = function () {
    var self = this;
    return this
      .dcmCompHierSearchSubmenu()
      .frame()
      .frame('container')
      .elementByCss('iframe[src="/DMS/servlet/com.trilogy.fs.dms.uicore.DMSCompoundPageServlet?AppName=DMS.DMS&PAGE=AgrHierarchySearch.HierarchySearch"]')
      .getAttribute('id').then(function (id) {
        console.log('Frame Id: ' + id);
        return self.frame(id);
      })
      .frame('subpage');
  };

  // selects Comp Hierarchy components frame
  wd.PromiseChainWebdriver.prototype.dcmCompHierarchyComponentsPage = function () {
    return this
      .dcmCompHierarchyPage()
      .frame('component_iframe');
  };

  // selects Comp Hier Tree View main frame
  wd.PromiseChainWebdriver.prototype.dcmCompHierarchyTreeViewPage = function () {
    var self = this;
    return this
      .dcmCompHierTreeViewSubmenu()
      .dcmCompHierarchyComponentsPage();
  };

  // selects Comp Hier Root Positions main frame
  wd.PromiseChainWebdriver.prototype.dcmCompHierarchyRootPositionsPage = function () {
    var self = this;
    return this
      .dcmCompHierRootPositionsSubmenu()
      .dcmCompHierarchyComponentsPage();
  };

  // opens New Product Hierarchy Page
  wd.PromiseChainWebdriver.prototype.dcmNewProductHierarchyPage = function () {
    var self = this;
    return this
      .dcmProductHierarchyPage()
      .elementById('Button_ProductHierarchySearch_ProductHierarchy_NewProductHierarchy').click()
      .frame()
      .frame('container')
      .elementByCss('iframe[src="/DMS/servlet/com.trilogy.fs.dms.uicore.DMSCompoundPageServlet?AppName=DMS.DMS&PAGE=ProductHierarchySearch.ProductHierarchySearch"]')
      .getAttribute('id').then(function (id) {
        console.log('Frame Id: ' + id);
        return self.frame(id);
      })
      .frame('proppage');
  };

  // opens New Comp Hierarchy Page
  wd.PromiseChainWebdriver.prototype.dcmNewCompHierarchyPage = function () {
    var self = this;
    return this
      .dcmCompHierarchyPage()
      .elementById('Button_HierarchySearch_NewAgrHierarchy').click()
      .frame()
      .frame('container')
      .elementByCss('iframe[src="/DMS/servlet/com.trilogy.fs.dms.uicore.DMSCompoundPageServlet?AppName=DMS.DMS&PAGE=AgrHierarchySearch.HierarchySearch"]')
      .getAttribute('id').then(function (id) {
        console.log('Frame Id: ' + id);
        return self.frame(id);
      })
      .frame('proppage');
  };

  // opens New Comp Hierarchy Page
  wd.PromiseChainWebdriver.prototype.dcmNewCompHierarchyRootPositionPage = function () {
    var self = this;
    return this
      .dcmCompHierarchyRootPositionsPage()
      .elementById('Button_AddAgrHierRootPosition').click()
      .frame()
      .frame('container')
      .elementByCss('iframe[src="/DMS/servlet/com.trilogy.fs.dms.uicore.DMSCompoundPageServlet?AppName=DMS.DMS&PAGE=AgrHierarchySearch.HierarchySearch"]')
      .getAttribute('id').then(function (id) {
        console.log('Frame Id: ' + id);
        return self.frame(id);
      })
      .frame('proppage');
  };

  // opens View in Comp Hierarchy Page
  wd.PromiseChainWebdriver.prototype.dcmViewInCompHierarchyPage = function () {
    var self = this;
    return this
      .dcmCompHierarchyTreeViewPage()
      .elementById('Button_AgrHierarchySearchTree_ViewInHierarchy').click()
      .frame()
      .frame('container')
      .elementByCss('iframe[src^="/DMS/servlet/com.trilogy.fs.dms.uicore.DMSCompoundPageServlet?AppName=DMS.DMS&PAGE=AgrHierarchyDisplay.HierarchyOverview&transferfields=true&Field_Hierarchy_PositionGID"]')
      .getAttribute('id').then(function (id) {
        console.log('Frame Id: ' + id);
        return self.frame(id);
      })
      .frame('subpage');
  };

  // searches for Product Hierarchy by Name
  wd.PromiseChainWebdriver.prototype.dcmSearchProductHierarchyByName = function (name) {
    return this
      .elementByCss('form[name=Search_ProductHierarchySearch_Main_primaryForm] input[name=Field_ProductHierarchySearch_Main_Name_Search_Value]')
      .type(name)
      .elementByLinkText('Search').click();
  };  

  // searches for Comp Hierarchy by Name  
  wd.PromiseChainWebdriver.prototype.dcmSearchCompHierarchyByName = function (name) {
    return this
      .elementByCss('form[name=Search_AgrHierarchySearch_Main_primaryForm] input[name=Field_Hierarchy_Name_Search_Value]')
      .type(name)
      .elementByLinkText('Search').click();
  };

  // selects Contract Kit Compensation main frame
  wd.PromiseChainWebdriver.prototype.dcmContractKitPage = function () {
    var self = this;
    return this
      .frame()
      .frame('container')
      .elementByCss('iframe[src="/DMS/servlet/com.trilogy.fs.dms.uicore.DMSCompoundPageServlet?AppName=DMS.DMS&PAGE=Contracts.ContractsSearch"]')
      .getAttribute('id').then(function (id) {
        console.log('Frame Id: ' + id);
        return self.frame(id);
      })
      .frame('subpage');
  };

  // searches for Contract Kit by Name
  wd.PromiseChainWebdriver.prototype.dcmSearchContractKitByName = function (name) {
    return this
      .elementByCss('form[name=Search_Contracts_Main_primaryForm] input[name=Field_Contracts_Main_Name_Search_Value]')
      .type(name)
      .elementByLinkText('Search').click();
  };

  // opens New Contract Kit page and selects main property frame
  wd.PromiseChainWebdriver.prototype.dcmNewContractKitPage = function () {
    var self = this;
    return this
      .dcmContractKitPage()
      .elementById('Button_Contracts_Main_NewContractKit').click()
      .frame()
      .frame('container')
      .elementByCss('iframe[src="/DMS/servlet/com.trilogy.fs.dms.uicore.DMSCompoundPageServlet?AppName=DMS.DMS&PAGE=Contracts.ContractsSearch"]')
      .getAttribute('id').then(function (id) {
        console.log('Frame Id: ' + id);
        return self.frame(id);
      })
      .frame('proppage');
  };

  // checks in Contract Kit
  wd.PromiseChainWebdriver.prototype.dcmCheckinContractKit = function () {
    var self = this;
    return this
      .elementById('Button_Contracts_Main_ContractKitCheckIn').click()
      .frame()
      .frame('container')
      .elementByCss('iframe[src="/DMS/servlet/com.trilogy.fs.dms.uicore.DMSCompoundPageServlet?AppName=DMS.DMS&PAGE=Contracts.ContractsSearch"]')
      .getAttribute('id').then(function (id) {
        console.log('Frame Id: ' + id);
        return self.frame(id);
      })
      .frame('proppage')
      .elementByCss('a#save').click();
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

  // creates person party
  wd.PromiseChainWebdriver.prototype.dcmCreateOrgParty = function (options) {
    var params = {
      "name": options.name,
      "taxId": options.taxId,
      "syncWithPdb": options.syncWithPdb,
      "roles": options.roles,
      "street": options.street,
      "city": options.city,
      "zipCode": options.zipCode
    };

    var promise = this
      .dcmPartyTab()
      .dcmNewOrgPartyPage();

    if (params.name) {
      promise = promise
        .elementByCss('input[name="Party.Name"]').type(params.name);
    }
    if (params.taxId) {
      promise = promise
        .elementByCss('input[name="Party.TaxID"]').type(params.taxId); 
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

    if (params.roles) {
      // scroll to the roles
      promise = promise
        .execute('scrollTo(0,200)');

      var i;
      for (i = 0; i < params.roles.length; ++i) {
        var role = params.roles[i];
        if (role === 'appointingCompany') {
          promise = promise
            .elementByCss('input[name=RoleAPPOINTINGCOMPANY] ~ i').click();
        } else if (role === 'contractKitProvider') {
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

  // creates product hierarchy
  wd.PromiseChainWebdriver.prototype.dcmCreateProductHierarchy = function (options) {
    var params = {
      "name": options.name,
      "description": options.description
    };

    var promise = this
      .dcmHierarchyTab()
      .dcmNewProductHierarchyPage();

    if (params.name) {
      promise = promise
        .elementByCss('input[name="Name"]').type(params.name);
    }
    if (params.description) {
      promise = promise
        .elementByCss('input[name="Description"]').type(params.description); 
    }

    return promise
      .elementByCss('a#save').click();
  };

  // creates comp hierarchy
  wd.PromiseChainWebdriver.prototype.dcmCreateCompHierarchy = function (options) {
    var self = this;
    var params = {
      "name": options.name,
      "description": options.description,
      "contractKitName": options.contractKitName
    };

    var promise = this
      .dcmHierarchyTab()
      .dcmNewCompHierarchyPage();

    if (params.name) {
      promise = promise
        .elementByCss('input[name="Name"]').type(params.name);
    }
    if (params.description) {
      promise = promise
        .elementByCss('input[name="Description"]').type(params.description); 
    }

    if (options.contractKitName) {
      promise = promise
        .elementByCss('#searchContractKitSearchPage_search_div').click()
        .sleep(5000)
        .execute('scrollTo(0,200)')
        .sleep(200)
        .frame('ContractKitSearchPage_search_div_frame')
        .elementByCss('input[name=Field_ContractKit_Name_Search_Value]').type(options.contractKitName)
        .elementByLinkText('Search').click()
        .sleep(3000)
        .execute('scrollTo(0,200)')
        .elementByCss('table#Grid_ContractKit tbody tr td:nth-child(1)').click()
        .elementByCss('a#Button_ContractKitSearch_PP_Select').click()
        .frame()
        .frame('container')
        .elementByCss('iframe[src="/DMS/servlet/com.trilogy.fs.dms.uicore.DMSCompoundPageServlet?AppName=DMS.DMS&PAGE=AgrHierarchySearch.HierarchySearch"]')
        .getAttribute('id').then(function (id) {
          console.log('Frame Id: ' + id);
          return self.frame(id);
        })
        .frame('proppage')
    }

    return promise
      .elementByCss('a#save').click();
  };

  // creates comp hierarchy root position (comp hierarchy should be selected)
  wd.PromiseChainWebdriver.prototype.dcmCreateCompHierarchyRootPosition = function (options) {
    var params = {
      "name": options.name,
      "description": options.description
    };

    var promise = this
      .dcmNewCompHierarchyRootPositionPage();

    if (params.name) {
      promise = promise
        .elementByCss('input[name="Name"]').type(params.name);
    }
    if (params.description) {
      promise = promise
        .elementByCss('input[name="Description"]').type(params.description); 
    }

    return promise
      .elementByCss('a#save').click();
  };

  // creates person party
  wd.PromiseChainWebdriver.prototype.dcmCreateContractKit = function (options) {
    var self = this;
    var params = {
      "name": options.name,
      "description": options.description,
      "contractKitProvider": options.contractKitProvider,
      "productHierarchy": options.productHierarchy
    };

    var promise = this
      .dcmCompensationTab()
      .dcmNewContractKitPage();

    if (params.name) {
      promise = promise
        .elementByCss('input[name="Name"]').type(params.name);
    }
    if (params.description) {
      promise = promise
        .elementByCss('input[name="Description"]').type(params.description); 
    }
    if (params.productHierarchy) {
      promise = promise
        .elementByCss('button[data-id=Products]').click().sleep(150)
        .elementsByCss('button[data-id=Products] ~ .dropdown-menu li a span.text')
        .then(function (elements) {
          var i;
          var deferred = Q.defer(promise);
          for (i = 0; i < elements.length; ++i) {
            (function (idx) {
              elements[idx].text().then(function (text) {
                if (text == params.productHierarchy) {
                  console.log('Product hier index: ' + idx);
                  self
                    .elementByCss('button[data-id=Products] ~ .dropdown-menu li:nth-child(' + (idx + 1) + ') a')
                    .click().then(function () {
                      deferred.resolve();
                    });
                }
              });
            })(i);
          }
          return deferred.promise;
        });
    }
    if (params.contractKitProvider) {
      promise = promise
        .elementByCss('button[data-id=Party]').click().sleep(150)
        .elementsByCss('button[data-id=Party] ~ .dropdown-menu li a span.text')
        .then(function (elements) {
          var i;
          var deferred = Q.defer(promise);
          for (i = 0; i < elements.length; ++i) {
            (function (idx) {
              elements[idx].text().then(function (text) {
                if (text.indexOf(params.contractKitProvider) >= 0) {
                  console.log('Contract kit provider index: ' + idx);
                  self
                    .elementByCss('button[data-id=Party] ~ .dropdown-menu li:nth-child(' + (idx + 1) + ') a')
                    .click().then(function () {
                      deferred.resolve();
                    });
                }
              });
            })(i);
          }
          return deferred.promise;
        });
    }

    return promise
      .elementByCss('a#save').click();
  };

  return wd;
};