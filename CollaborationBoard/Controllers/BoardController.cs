using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CollaborationBoard.Controllers
{
    public class BoardController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [Route("Board/Id/{id}")]
        public ActionResult Id(string id)
        {
            ViewBag.BoardId = id;

            return View();
        }

        [Route("Board/New")]
        public JsonResult CreateBoard()
        {
            var result = BoardManager.AddNewBoard();

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}