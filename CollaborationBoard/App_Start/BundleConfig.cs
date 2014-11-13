using System.Web;
using System.Web.Optimization;

namespace CollaborationBoard
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.FileSetOrderList.Clear();

            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-2.1.1.js").Include(
                        "~/Scripts/jquery.signalR-2.1.1.js").Include(
                        "~/Scripts/jquery-ui.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate.unobtrusive.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-2.6.2.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/bundles/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css",
                      "~/Content/jquery-ui.css"));

            bundles.Add(new ScriptBundle("~/katex_script").Include("~/Scripts/katex.min.js"));
            bundles.Add(new StyleBundle("~/katex_css").Include("~/Content/katex.min.css"));

            bundles.Add(new ScriptBundle("~/bundles/app_scripts").IncludeDirectory("~/Scripts/App/", "*.js", true));
            bundles.Add(new ScriptBundle("~/bundles/common_scripts").IncludeDirectory("~/Scripts/Common/", "*.js"));

            var lessBundle = new StyleBundle("~/bundles/app_styles").IncludeDirectory("~/Content/App/", "*.less").IncludeDirectory("~/Content/App/", "*.css");
            lessBundle.Transforms.Add(new LessTransform());
            lessBundle.Transforms.Add(new CssMinify());
            bundles.Add(lessBundle);

            bundles.Add(new StyleBundle("~/bundles/font_awesome").Include("~/Content/font-awesome.css"));

            bundles.Add(new ScriptBundle("~/signalr", "/signalr/hubs"));
            bundles.UseCdn = true;

            bundles.Add(new StyleBundle("~/fonts", "http://fonts.googleapis.com/css?family=Open+Sans"));

            BundleTable.EnableOptimizations = true;

#if DEBUG
            BundleTable.EnableOptimizations = false;
#endif
        }
    }
}
