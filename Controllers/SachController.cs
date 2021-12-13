using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestTV.Controllers
{
    public class SachController : Controller
    {
        [Route("")]
        [Route("Sach")]
        public IActionResult Sach()
        {
            return View();
        }
        [Route("Loaisach")]
        public IActionResult LoaiSach()
        {
            return View();
        }
        [Route("Muontra")]
        public IActionResult MuonTra()
        {
            return View();
        }
        [Route("Docgia")]
        public IActionResult DocGia()
        {
            return View();
        }
    }
}
