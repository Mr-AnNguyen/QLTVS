using BLL;
using DAL.Connect;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using TestTV.Models;

namespace TestTV.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : Controller
    {
        /*private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }*/
        private ISachBus _sachBus;
        public HomeController(ISachBus sachBus)
        { 
            _sachBus = sachBus;
        }

        [Route("get-all")]
        [HttpGet]
        public IEnumerable<SachModel> GetAll()
        {
            return _sachBus.GetAll();
        }
        [Route("get-id/{id}")]
        [HttpGet]
        public SachModel GetID(int id)
        {
            return _sachBus.GetID(id);
        }
        [Route("create")]
        [HttpPost]
        public SachModel CreateSach([FromBody] SachModel model)
        {
            _sachBus.Create(model);
            return model;
        }
        [Route("update")]
        [HttpPut]
        public SachModel UpdateSach([FromBody] SachModel model)
        {
            _sachBus.Update(model);
            return model;
        }
        [Route("delete")]
        [HttpPost]
        public IActionResult DeletePro([FromBody] Dictionary<string, object> formData)
        {
            string id = ""; 
            if (formData.Keys.Contains("maSach") && !string.IsNullOrEmpty(Convert.ToString(formData["maSach"]))) { id = Convert.ToString(formData["maSach"]); }
            _sachBus.Delete(id);
            return Ok();
        }

        public IActionResult Index()
        {
            
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
