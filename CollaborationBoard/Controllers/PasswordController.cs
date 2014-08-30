using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CollaborationBoard.Controllers
{
    public class PasswordController : Controller
    {
        [Route("Password/Board/{id}")]
        [HttpGet]
        public ActionResult Login(string id)
        {
            Board board = BoardManager.GetBoard(id);

            if (board == null)
            {
                ViewBag.ErrorMessage = "No such board exists";

                return View("BoardError");
            }

            if (!board.PasswordEnabled)
            {
                return new RedirectResult("/board/" + id);
            }

            ViewBag.BoardId = id;

            return View();
        }

        [Route("Password/Board/{id}/Validate")]
        [HttpPost]
        public ActionResult ValidatePassword(string id, string password)
        {
            var board = BoardManager.GetBoard(id);

            if (board == null)
            {
                ViewBag.ErrorMessage = "No such board exists";

                return View("BoardError");
            }

            if (!board.PasswordEnabled)
            {
                return new RedirectResult("/board/" + id);
            }

            if (board.Password == password)
            {
                if (!AuthManager.IsUserAuthenticated(Session.SessionID, id))
                {
                    AuthManager.AuthenticateUser(Session.SessionID, id);
                }

                return new RedirectResult("/board/" + id);
            }

            ViewBag.ErrorMessage = "Incorrect Password";

            return View("BoardError");
        }
    }
}