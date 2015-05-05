using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CollaborationBoard
{
    public class PaperController : Controller
    {
        [Route("Paper/{id}")]
        [HttpGet]
        public ActionResult Id(string id)
        {
            ViewBag.BoardId = id;

            if (!BoardManager.BoardExists(id))
            {
                ViewBag.ErrorMessage = "No such sheet exists";

                return View("BoardError");
            }

            Board board = BoardManager.GetBoard(id);

            if (board.PasswordEnabled)
            {
                if (AuthManager.IsUserAuthenticated(Session.SessionID, id))
                {
                    return View("Sheet");
                }
            }
            else
            {
                return View("Sheet");
            }

            return new RedirectResult("/password/paper/" + id);
        }

        [Route("Paper/Create")]
        [HttpPost]
        public ActionResult NewBoard([Bind(Include = "Title,Password,PasswordEnabled,PasswordRepeat")]BoardModel model)
        {
            if (ModelState.IsValid)
            {
                string id = BoardManager.CreateBoard(model);

                AuthManager.AuthenticateUser(Session.SessionID, id);

                return new RedirectResult("/paper/" + id);
            }

            ViewBag.ErrorMessage = "The parameters for creating the board were incorrect";

            return View("BoardError");
        }
    }
}