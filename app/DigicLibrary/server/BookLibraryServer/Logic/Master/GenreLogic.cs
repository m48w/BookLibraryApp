using BookLibraryServer.Contract.Logic.Master;
using BookLibraryServer.Contract.Models.Master;
using BookLibraryServer.Contract.Repositories.Master;

namespace BookLibraryServer.Logic.Master
{
    public class GenreLogic : IGenreLogic
    {
        private readonly IGenreRepository _genreRepository;

        public GenreLogic(IGenreRepository genreRepository)
        {
            _genreRepository = genreRepository;
        }

        public async Task<IEnumerable<IGenreModel>> GetAllGenresAsync()
        {
            return await _genreRepository.GetAllGenresAsync();
        }
    }
}
