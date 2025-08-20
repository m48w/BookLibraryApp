using BookLibraryServer.Contract.Models.Master;

namespace BookLibraryServer.Contract.Logic.Master
{
    public interface IGenreLogic
    {
        Task<IEnumerable<IGenreModel>> GetAllGenresAsync();
    }
}
