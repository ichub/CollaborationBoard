using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(CollaborationBoard.Startup))]
namespace CollaborationBoard
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();

#if DEBUG
            BoardManager.CreateBoard(new BoardModel("test", "test", true), "test");
#endif
        }
    }
}
