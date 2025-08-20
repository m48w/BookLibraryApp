using BookLibraryServer.Contract.Models.Master;

namespace BookLibraryServer.Models.Master
{
    public class UsersModel : IUserModel
    {
        public int? Id { get; }
        public string? Name { get; }
        public string? Email { get; }


        public UsersModel(int? id, string? name, string? email)
        {
            Id = id;
            Name = name;
            Email = email;
        }
    }
}
