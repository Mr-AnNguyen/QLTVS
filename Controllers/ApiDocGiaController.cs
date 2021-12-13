using BLL;
using Microsoft.AspNetCore.Mvc;
using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestTV.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApiDocGiaController : Controller
    {
        private IDocGiaBus _docGiaBus;
        public ApiDocGiaController(IDocGiaBus docGiaBus)
        {
            _docGiaBus = docGiaBus;
        }

        [Route("get-all")]
        [HttpGet]
        public IEnumerable<DocGiaModel> GetAll()
        {
            return _docGiaBus.GetAll();
        }
        [Route("get-id/{id}")]
        [HttpGet]
        public DocGiaModel GetID(int id)
        {
            return _docGiaBus.GetID(id);
        }
        [Route("create")]
        [HttpPost]
        public DocGiaModel CreateSach([FromBody] DocGiaModel model)
        {
            _docGiaBus.Create(model);
            return model;
        }
        [Route("update")]
        [HttpPut]
        public DocGiaModel UpdateSach([FromBody] DocGiaModel model)
        {
            _docGiaBus.Update(model);
            return model;
        }
        [Route("delete")]
        [HttpPost]
        public IActionResult DeletePro([FromBody] Dictionary<string, object> formData)
        {
            string id = "";
            if (formData.Keys.Contains("maSach") && !string.IsNullOrEmpty(Convert.ToString(formData["maSach"]))) { id = Convert.ToString(formData["maSach"]); }
            _docGiaBus.Delete(id);
            return Ok();
        }
    }
}
