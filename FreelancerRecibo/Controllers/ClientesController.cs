using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json; 
using FreelancerRecibo.Models;

namespace ReciboFreelancer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        [HttpPost]
        [Route("PDF")]
        public async Task<IActionResult> PDF([FromBody] JsonContent jsonContent)
        {
            try
            {
                // Lee el contenido JSON del objeto JsonContent
                string jsonString = await jsonContent.ReadAsStringAsync();

                // Deserializa el JSON en un objeto UsuariosRegister
                UsuariosRegister usuario = JsonConvert.DeserializeObject<UsuariosRegister>(jsonString);

                // Agrega el objeto UsuariosRegister a la base de datos
                await _dbcontext.UsuariosRegisters.AddAsync(usuario);
                await _dbcontext.SaveChangesAsync();

                return StatusCode(StatusCodes.Status200OK, "ok");
            }
            catch (Exception ex)
            {
                // Maneja cualquier excepción que pueda ocurrir durante el proceso
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }
        private readonly DatosClienteContext _dbcontext;

        public ClientesController(DatosClienteContext context)
        {
            _dbcontext = context;
        }


        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Lista() {
            List<UsuariosRegister> list =_dbcontext.UsuariosRegisters.OrderByDescending(t =>t.Nombres).ThenBy(t =>t.TipoDocumento).ToList();
            return StatusCode(StatusCodes.Status200OK, list);

        }
        [HttpDelete]
        [Route("Eliminar/{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            UsuariosRegister usuario = _dbcontext.UsuariosRegisters.Find(id);
            _dbcontext.UsuariosRegisters.Remove(usuario);
            await _dbcontext.SaveChangesAsync();
            return StatusCode(StatusCodes.Status200OK, "ok");
        }
    }
}
