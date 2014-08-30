using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CollaborationBoard
{
    public class BoardController : Controller
    {
        [Route("Board/{id}")]
        [HttpGet]
        public ActionResult Id(string id)
        {
            ViewBag.BoardId = id;

            if (BoardManager.BoardExists(id))
            {
                return View("Board");
            }

            ViewBag.ErrorMessage = "No such board exists";

            return View("BoardError");
        }

        [Route("Board/Create")]
        [HttpPost]
        public ActionResult NewBoard([Bind(Include="Title,Password,PasswordEnabled,PasswordRepeat")]BoardModel model)
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