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
                        "~/Scripts/jquery-2.1.4.js").Include(
                        "~/Scripts/jquery.signalR-2.2.0.js").Include(
                        "~/Scripts/jquery-ui.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate.unobtrusive.js"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-2.6.2.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));


            var globalStyleBundle = new StyleBundle("~/bundles/css").Include(
                      "~/Content/styles.less");

            globalStyleBundle.Transforms.Add(new LessTransform());
            globalStyleBundle.Transforms.Add(new CssMinify());

            bundles.Add(globalStyleBundle);

            bundles.Add(new ScriptBundle("~/katex_script").Include("~/Scripts/katex.min.js"));
            bundles.Add(new StyleBundle("~/katex_css").Include("~/Content/katex.min.css"));

            bundles.Add(new ScriptBundle("~/bundles/app_scripts").IncludeDirectory("~/Scripts/App/", "*.js", true));
            bundles.Add(new ScriptBundle("~/bundles/common_scripts").IncludeDirectory("~/Scripts/Common/", "*.js"));

            bundles.Add(new StyleBundle("~/bundles/font_awesome").Include("~/Content/font-awesome.css"));

            bundles.Add(new ScriptBundle("~/signalr", "/signalr/hubs"));
            bundles.UseCdn = true;

            //BundleTable.EnableOptimizations = true;
            BundleTable.EnableOptimizations = false;

#if DEBUG
            BundleTable.EnableOptimizations = false;
#endif
        }
    }
}
