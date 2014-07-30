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

        [Route("Board/New")]
        [HttpGet]
        public JsonResult CreateBoard()
        {
            var result = BoardManager.AddNewBoard();

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [Route("Board/Sync/{id}/{lastSync}")]
        [HttpPost]
        public JsonResult Sync(string id, int lastSync)
        {
            var syncUp = this.ReadFromRequest<SyncUpModel>();

            var board = BoardManager.GetBoard(id);

            if (board != null)
            {
                var actions = board.GetActionsSince(lastSync);

                return Json(new SyncDownModel(actions));
            }

            return Json(new GenericServerError("No such board exists"));
        }
    }
}