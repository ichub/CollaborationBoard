using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(CollaborationBoard.Startup))]
namespace CollaborationBoard
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);

            app.MapSignalR();
        }
    }
}
