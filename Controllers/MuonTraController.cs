using Microsoft.AspNetCore.Mvc;
using Models;
using BLL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestTV.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MuonTraController : Controller
    {
        private IMuonTraBus _muonTraBus;
        public MuonTraController(IMuonTraBus muonTraBus)
        {
            _muonTraBus = muonTraBus;
        }
        [Route("getmuon-all")]
        [HttpGet]
        public IEnumerable<MuonModel> GetAll()
        {
            return _muonTraBus.GetAll();
        }
        [Route("gettra-all")]
        [HttpGet]
        public IEnumerable<MuonModel> GetAllTra()
        {
            return _muonTraBus.GetAllTra();
        }

        [Route("get-id/{id}")]
        [HttpGet]
        public MuonModel GetId(int Id)
        {
            return _muonTraBus.GetID(Id);
        }

        [Route("muon")]
        [HttpPost]
        public MuonModel CreateMuon([FromBody] MuonModel model)
        {
            _muonTraBus.Muon(model);
            return model;
        }
        [Route("tra")]
        [HttpPut]
        public MuonModel UpdateTra([FromBody] MuonModel model)
        {
            _muonTraBus.Tra(model);
            return model;
        }

    }
}
