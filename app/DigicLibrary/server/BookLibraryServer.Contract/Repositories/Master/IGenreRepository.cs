using BookLibraryServer.Contract.Models.Master;

namespace BookLibraryServer.Contract.Repositories.Master
{
    public interface IGenreRepository
    {
        Task<IEnumerable<IGenreModel>> GetAllGenresAsync();
    }
}
