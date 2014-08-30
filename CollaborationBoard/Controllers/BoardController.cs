using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CollaborationBoard
{
    public class BoardController : Controller
    {
        private string GetPassword(string boardId)
        {
            string key = String.Format("BoardPassword:{0}", boardId);

            if (ControllerContext.HttpContext.Request.Cookies.AllKeys.Contains(key))
            {
                return ControllerContext.HttpContext.Request.Cookies.Get(key).Value;
            }

            return null;
        }

        [Route("Board/{id}")]
        [HttpGet]
        public ActionResult Id(string id)
        {
            ViewBag.BoardId = id;

            if (!BoardManager.BoardExists(id))
            {
                ViewBag.ErrorMessage = "No such board exists";

                return View("BoardError");
            }

            Board board = BoardManager.GetBoard(id);

            if (board.PasswordEnabled)
            {
                string storedPassword = this.GetPassword(id);

                if (storedPassword != null)
                {
                    if (storedPassword == board.Password)
                    {
                        return View("Board");
                    }
                }
            }

            return new RedirectResult("/password/board/" + id);
        }

        [Route("Board/Create")]
        [HttpPost]
        public ActionResult NewBoard([Bind(Include = "Title,Password,PasswordEnabled,PasswordRepeat")]BoardModel model)
        {
            if (ModelState.IsValid)
            {
                string id = BoardManager.CreateBoard(model);

                return new RedirectResult("/board/" + id);
            }

            ViewBag.ErrorMessage = "The parameters for creating the board were incorrect";

            return View("BoardError");
        }
    }
}