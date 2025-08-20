using BookLibraryServer.Contract.Data;
using BookLibraryServer.Contract.Logic.Master;
using Microsoft.AspNetCore.Mvc;

namespace BookLibraryServer.Controllers
{
    [ApiController]
    [Route("api/v1/master")]
    [Produces("application/json")]
    public class MasterController : ControllerBase
    {
        private readonly IAuthorLogic _authorLogic;
        private readonly IGenreLogic _genreLogic;
        private readonly IUserLogic _userLogic;
        private readonly IDbConnectionFactory _dbConnectionFactory;

        public MasterController(IAuthorLogic authorLogic, IGenreLogic genreLogic, IUserLogic userLogic, IDbConnectionFactory dbConnectionFactory)
        {
            _authorLogic = authorLogic;
            _genreLogic = genreLogic;
            _userLogic = userLogic;
            _dbConnectionFactory = dbConnectionFactory;
        }

        [HttpGet("authors")]
        public async Task<IActionResult> GetAuthors()
        {
            var authors = await _authorLogic.GetAllAuthorsAsync();
            return Ok(authors);
        }

        [HttpGet("genres")]
        public async Task<IActionResult> GetGenres()
        {
            var genres = await _genreLogic.GetAllGenresAsync();
            return Ok(genres);
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userLogic.GetAllUsersAsync();
            return Ok(users);
        }
    }
}