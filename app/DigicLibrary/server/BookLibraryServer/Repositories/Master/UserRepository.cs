using BookLibraryServer.Contract.Data;
using BookLibraryServer.Contract.Models.Master;
using BookLibraryServer.Contract.Repositories.Master;
using BookLibraryServer.Models.Master;
using Dapper;

namespace BookLibraryServer.Repositories.Master
{
    public class UserRepository : IUserRepository
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;

        public UserRepository(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public async Task<IEnumerable<IUserModel>> GetAllUsersAsync()
        {
            var query = @"
SELECT
  U.user_id AS Id
  , U.name AS Name
  , U.email AS Email
  , U.call_code AS CallCode
  , U.name_kana AS NameKana
  , U.notes AS Notes
  , D.department_id AS DepartmentId
  , D.name AS DepartmentName
FROM dbo.Users AS U
LEFT JOIN dbo.Departments AS D
  ON U.department_id = D.department_id
";

            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var users = await connection.QueryAsync<UsersModel>(query);
                return users.Cast<IUserModel>();
            });
        }
    }
}
