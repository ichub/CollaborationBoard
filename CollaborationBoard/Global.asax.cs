using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace CollaborationBoard
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            ValueProviderFactories.Factories.Add(new JsonValueProviderFactory());
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        protected void Session_Start(object sender, EventArgs e)
        {
            // http://stackoverflow.com/questions/281881/sessionid-keeps-changing-in-asp-net-mvc-why

            HttpContext.Current.Session.Add("__MyAppSession", string.Empty);

            if (!AuthManager.IsSessionInitialized(Session.SessionID))
            {
                AuthManager.InitializeSession(Session.SessionID);
            }
        }
    }
}
