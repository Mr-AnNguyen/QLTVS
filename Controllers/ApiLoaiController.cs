using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BLL;
using Models;

namespace TestTV.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApiLoaiController : Controller
    {
        private ILoaiBus _loaiBus;
        public ApiLoaiController(ILoaiBus loaiBus)
        {
            _loaiBus = loaiBus;
        }
        
        [Route("get-all")]
        [HttpGet]
        public IEnumerable<LoaiModel> GetAll()
        {
            return _loaiBus.GetAll();
        }

        [Route("get-id/{id}")]
        [HttpGet]
        public LoaiModel GetId(string Id)
        {
            return _loaiBus.GetId(Id);
        }

        [Route("create")]
        [HttpPost]
        public LoaiModel CreateLoai([FromBody] LoaiModel model)
        {
            _loaiBus.Create(model);
            return model;
        }
        [Route("update")]
        [HttpPut]
        public LoaiModel UpdateLoai([FromBody] LoaiModel model)
        {
            _loaiBus.Update(model);
            return model;
        }
        [Route("delete")]
        [HttpPost]
        public IActionResult DeletePro([FromBody] Dictionary<string, object> formData)
        {
            string id = "";
            if (formData.Keys.Contains("maLoai") && !string.IsNullOrEmpty(Convert.ToString(formData["maLoai"]))) { id = Convert.ToString(formData["maLoai"]); }
            _loaiBus.Delete(id);
            return Ok();
        }
    }
}
