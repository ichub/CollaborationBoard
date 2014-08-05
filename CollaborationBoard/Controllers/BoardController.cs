﻿using System;
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

            ViewBag.ErrorMessage = "No such board exists";

            return View("BoardError");
        }

        [Route("Board/New")]
        [HttpGet]
        public JsonResult CreateBoard()
        {
            return Json("asdf", JsonRequestBehavior.AllowGet);
        }
    }
}