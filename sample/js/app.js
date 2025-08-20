// アプリケーションの主要JavaScript機能

// グローバル変数
let currentEditingEmployee = null;
let currentEditingBook = null;
let employees = [];
let books = [];
let rentalHistory = [];

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    // セクション表示の初期化
    showSection('dashboard');
    
    // フォームイベントリスナーの設定
    setupEventListeners();
    
    // データの初期読み込み
    loadAllData();
    
    // 返却予定日のデフォルト値設定（2週間後）
    const today = new Date();
    const twoWeeksLater = new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000));
    document.getElementById('rental-due-date').value = twoWeeksLater.toISOString().split('T')[0];
});

// イベントリスナーの設定
function setupEventListeners() {
    // 社員フォーム
    document.getElementById('employee-form').addEventListener('submit', handleEmployeeSubmit);
    
    // 書籍フォーム
    document.getElementById('book-form').addEventListener('submit', handleBookSubmit);
    
    // 貸出フォーム
    document.getElementById('rental-form').addEventListener('submit', handleRentalSubmit);
    
    // 検索フィルター
    document.getElementById('employee-search').addEventListener('input', filterEmployees);
    document.getElementById('employee-department-filter').addEventListener('change', filterEmployees);
    document.getElementById('employee-status-filter').addEventListener('change', filterEmployees);
    
    document.getElementById('book-search').addEventListener('input', filterBooks);
    document.getElementById('book-category-filter').addEventListener('change', filterBooks);
    document.getElementById('book-status-filter').addEventListener('change', filterBooks);
    document.getElementById('book-location-filter').addEventListener('input', filterBooks);
    
    document.getElementById('history-employee-search').addEventListener('input', filterHistory);
    document.getElementById('history-book-search').addEventListener('input', filterHistory);
    document.getElementById('history-status-filter').addEventListener('change', filterHistory);
    document.getElementById('history-period-filter').addEventListener('change', filterHistory);
}

// セクション表示制御
function showSection(sectionName) {
    // すべてのセクションを非表示
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // ナビゲーションボタンの状態をリセット
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-primary', 'bg-blue-50');
        btn.classList.add('text-gray-600');
    });
    
    // 指定されたセクションを表示
    document.getElementById(sectionName).classList.remove('hidden');
    
    // アクティブなボタンをハイライト
    event.target.classList.remove('text-gray-600');
    event.target.classList.add('text-primary', 'bg-blue-50');
    
    // セクション別の初期化処理
    if (sectionName === 'dashboard') {
        updateDashboard();
    } else if (sectionName === 'employees') {
        displayEmployees();
    } else if (sectionName === 'books') {
        displayBooks();
    } else if (sectionName === 'rentals') {
        updateRentalSelects();
        displayCurrentRentals();
    } else if (sectionName === 'history') {
        displayHistory();
    }
}

// データの読み込み
async function loadAllData() {
    try {
        // 社員データの読み込み
        const employeesResponse = await fetch('tables/employees');
        const employeesData = await employeesResponse.json();
        employees = employeesData.data || [];
        
        // 書籍データの読み込み
        const booksResponse = await fetch('tables/books');
        const booksData = await booksResponse.json();
        books = booksData.data || [];
        
        // 貸出履歴データの読み込み
        const historyResponse = await fetch('tables/rental_history');
        const historyData = await historyResponse.json();
        rentalHistory = historyData.data || [];
        
        // フィルターオプションの更新
        updateFilterOptions();
        
        // 現在表示中のセクションに応じて表示を更新
        const currentSection = document.querySelector('.section:not(.hidden)').id;
        if (currentSection === 'dashboard') {
            updateDashboard();
        }
        
    } catch (error) {
        console.error('データの読み込みエラー:', error);
        showNotification('データの読み込みに失敗しました', 'error');
    }
}

// =============================================================================
// 社員管理機能
// =============================================================================

// 社員表示
function displayEmployees() {
    const container = document.getElementById('employees-table');
    
    if (employees.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">登録された社員がありません</p>';
        return;
    }
    
    const filteredEmployees = getFilteredEmployees();
    
    container.innerHTML = `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">社員番号</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">氏名</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">部署</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">メール</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">電話</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状態</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${filteredEmployees.map(employee => `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${employee.employee_id}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${employee.name}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${employee.department}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${employee.email || '-'}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${employee.phone || '-'}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${employee.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                    ${employee.active ? '在職中' : '退職済み'}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onclick="editEmployee('${employee.id}')" class="text-indigo-600 hover:text-indigo-900 mr-2">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="deleteEmployee('${employee.id}')" class="text-red-600 hover:text-red-900">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// 社員フィルタリング
function getFilteredEmployees() {
    const searchTerm = document.getElementById('employee-search').value.toLowerCase();
    const departmentFilter = document.getElementById('employee-department-filter').value;
    const statusFilter = document.getElementById('employee-status-filter').value;
    
    return employees.filter(employee => {
        const matchesSearch = !searchTerm || 
            employee.name.toLowerCase().includes(searchTerm) ||
            employee.employee_id.toLowerCase().includes(searchTerm);
        
        const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
        
        const matchesStatus = !statusFilter || employee.active.toString() === statusFilter;
        
        return matchesSearch && matchesDepartment && matchesStatus;
    });
}

function filterEmployees() {
    displayEmployees();
}

// 社員モーダル表示
function showEmployeeModal(employeeId = null) {
    const modal = document.getElementById('employee-modal');
    const title = document.getElementById('employee-modal-title');
    const form = document.getElementById('employee-form');
    
    // フォームリセット
    form.reset();
    currentEditingEmployee = employeeId;
    
    if (employeeId) {
        title.textContent = '社員編集';
        const employee = employees.find(e => e.id === employeeId);
        if (employee) {
            document.getElementById('employee-id').value = employee.employee_id;
            document.getElementById('employee-name').value = employee.name;
            document.getElementById('employee-department').value = employee.department;
            document.getElementById('employee-email').value = employee.email || '';
            document.getElementById('employee-phone').value = employee.phone || '';
            document.getElementById('employee-active').checked = employee.active;
        }
    } else {
        title.textContent = '社員登録';
        document.getElementById('employee-active').checked = true;
    }
    
    modal.classList.remove('hidden');
}

function hideEmployeeModal() {
    document.getElementById('employee-modal').classList.add('hidden');
    currentEditingEmployee = null;
}

// 社員保存処理
async function handleEmployeeSubmit(event) {
    event.preventDefault();
    
    const employeeData = {
        employee_id: document.getElementById('employee-id').value,
        name: document.getElementById('employee-name').value,
        department: document.getElementById('employee-department').value,
        email: document.getElementById('employee-email').value,
        phone: document.getElementById('employee-phone').value,
        active: document.getElementById('employee-active').checked
    };
    
    try {
        let response;
        if (currentEditingEmployee) {
            // 更新
            response = await fetch(`tables/employees/${currentEditingEmployee}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employeeData)
            });
        } else {
            // 新規作成
            response = await fetch('tables/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employeeData)
            });
        }
        
        if (response.ok) {
            hideEmployeeModal();
            await loadAllData();
            displayEmployees();
            showNotification(currentEditingEmployee ? '社員情報を更新しました' : '社員を登録しました', 'success');
        } else {
            throw new Error('保存に失敗しました');
        }
    } catch (error) {
        console.error('社員保存エラー:', error);
        showNotification('保存に失敗しました', 'error');
    }
}

// 社員編集
function editEmployee(employeeId) {
    showEmployeeModal(employeeId);
}

// 社員削除
async function deleteEmployee(employeeId) {
    if (!confirm('この社員を削除してもよろしいですか？')) {
        return;
    }
    
    try {
        const response = await fetch(`tables/employees/${employeeId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await loadAllData();
            displayEmployees();
            showNotification('社員を削除しました', 'success');
        } else {
            throw new Error('削除に失敗しました');
        }
    } catch (error) {
        console.error('社員削除エラー:', error);
        showNotification('削除に失敗しました', 'error');
    }
}

// =============================================================================
// 書籍管理機能
// =============================================================================

// 書籍表示
function displayBooks() {
    const container = document.getElementById('books-table');
    
    if (books.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">登録された書籍がありません</p>';
        return;
    }
    
    const filteredBooks = getFilteredBooks();
    
    container.innerHTML = `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISBN</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">書籍名</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">著者</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">出版社</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">カテゴリ</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">場所</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状態</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${filteredBooks.map(book => `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${book.isbn || '-'}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${book.title}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${book.author}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${book.publisher || '-'}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${book.category || '-'}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${book.location || '-'}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${book.status === '在庫' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                                    ${book.status || '在庫'}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onclick="editBook('${book.id}')" class="text-indigo-600 hover:text-indigo-900 mr-2">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="deleteBook('${book.id}')" class="text-red-600 hover:text-red-900">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// 書籍フィルタリング
function getFilteredBooks() {
    const searchTerm = document.getElementById('book-search').value.toLowerCase();
    const categoryFilter = document.getElementById('book-category-filter').value;
    const statusFilter = document.getElementById('book-status-filter').value;
    const locationFilter = document.getElementById('book-location-filter').value.toLowerCase();
    
    return books.filter(book => {
        const matchesSearch = !searchTerm || 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            (book.isbn && book.isbn.toLowerCase().includes(searchTerm));
        
        const matchesCategory = !categoryFilter || book.category === categoryFilter;
        const matchesStatus = !statusFilter || book.status === statusFilter;
        const matchesLocation = !locationFilter || (book.location && book.location.toLowerCase().includes(locationFilter));
        
        return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
    });
}

function filterBooks() {
    displayBooks();
}

// 書籍モーダル表示
function showBookModal(bookId = null) {
    const modal = document.getElementById('book-modal');
    const title = document.getElementById('book-modal-title');
    const form = document.getElementById('book-form');
    
    // フォームリセット
    form.reset();
    currentEditingBook = bookId;
    
    if (bookId) {
        title.textContent = '書籍編集';
        const book = books.find(b => b.id === bookId);
        if (book) {
            document.getElementById('book-isbn').value = book.isbn || '';
            document.getElementById('book-title').value = book.title;
            document.getElementById('book-author').value = book.author;
            document.getElementById('book-publisher').value = book.publisher || '';
            document.getElementById('book-category').value = book.category || '';
            document.getElementById('book-location').value = book.location || '';
        }
    } else {
        title.textContent = '書籍登録';
    }
    
    modal.classList.remove('hidden');
}

function hideBookModal() {
    document.getElementById('book-modal').classList.add('hidden');
    currentEditingBook = null;
}

// 書籍保存処理
async function handleBookSubmit(event) {
    event.preventDefault();
    
    const bookData = {
        isbn: document.getElementById('book-isbn').value,
        title: document.getElementById('book-title').value,
        author: document.getElementById('book-author').value,
        publisher: document.getElementById('book-publisher').value,
        category: document.getElementById('book-category').value,
        location: document.getElementById('book-location').value,
        status: '在庫',
        borrowed_by: ''
    };
    
    try {
        let response;
        if (currentEditingBook) {
            // 編集時は既存の貸出情報を保持
            const existingBook = books.find(b => b.id === currentEditingBook);
            if (existingBook) {
                bookData.status = existingBook.status;
                bookData.borrowed_by = existingBook.borrowed_by;
            }
            
            response = await fetch(`tables/books/${currentEditingBook}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData)
            });
        } else {
            // 新規作成
            response = await fetch('tables/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData)
            });
        }
        
        if (response.ok) {
            hideBookModal();
            await loadAllData();
            displayBooks();
            showNotification(currentEditingBook ? '書籍情報を更新しました' : '書籍を登録しました', 'success');
        } else {
            throw new Error('保存に失敗しました');
        }
    } catch (error) {
        console.error('書籍保存エラー:', error);
        showNotification('保存に失敗しました', 'error');
    }
}

// 書籍編集
function editBook(bookId) {
    showBookModal(bookId);
}

// 書籍削除
async function deleteBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book && book.status === '貸出中') {
        showNotification('貸出中の書籍は削除できません', 'error');
        return;
    }
    
    if (!confirm('この書籍を削除してもよろしいですか？')) {
        return;
    }
    
    try {
        const response = await fetch(`tables/books/${bookId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await loadAllData();
            displayBooks();
            showNotification('書籍を削除しました', 'success');
        } else {
            throw new Error('削除に失敗しました');
        }
    } catch (error) {
        console.error('書籍削除エラー:', error);
        showNotification('削除に失敗しました', 'error');
    }
}

// =============================================================================
// 貸出管理機能
// =============================================================================

// 貸出・返却選択肢の更新
function updateRentalSelects() {
    const employeeSelect = document.getElementById('rental-employee');
    const bookSelect = document.getElementById('rental-book');
    const returnSelect = document.getElementById('return-book');
    
    // 社員選択肢（在職中のみ）
    const activeEmployees = employees.filter(e => e.active);
    employeeSelect.innerHTML = '<option value="">社員を選択してください</option>' +
        activeEmployees.map(employee => 
            `<option value="${employee.id}">${employee.name} (${employee.employee_id})</option>`
        ).join('');
    
    // 貸出可能書籍（在庫のみ）
    const availableBooks = books.filter(b => b.status === '在庫');
    bookSelect.innerHTML = '<option value="">書籍を選択してください</option>' +
        availableBooks.map(book => 
            `<option value="${book.id}">${book.title} - ${book.author}</option>`
        ).join('');
    
    // 返却対象書籍（貸出中のみ）
    const borrowedBooks = books.filter(b => b.status === '貸出中');
    returnSelect.innerHTML = '<option value="">返却する書籍を選択してください</option>' +
        borrowedBooks.map(book => {
            const borrower = employees.find(e => e.id === book.borrowed_by);
            return `<option value="${book.id}">${book.title} - ${borrower ? borrower.name : '不明'}</option>`;
        }).join('');
}

// 貸出処理
async function handleRentalSubmit(event) {
    event.preventDefault();
    
    const employeeId = document.getElementById('rental-employee').value;
    const bookId = document.getElementById('rental-book').value;
    const dueDate = document.getElementById('rental-due-date').value;
    
    if (!employeeId || !bookId || !dueDate) {
        showNotification('すべての項目を入力してください', 'error');
        return;
    }
    
    try {
        // 貸出履歴レコード作成
        const rentalData = {
            book_id: bookId,
            employee_id: employeeId,
            borrowed_date: Date.now(),
            due_date: new Date(dueDate).getTime(),
            returned_date: null,
            status: '貸出中'
        };
        
        const rentalResponse = await fetch('tables/rental_history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rentalData)
        });
        
        if (!rentalResponse.ok) {
            throw new Error('貸出履歴の作成に失敗しました');
        }
        
        // 書籍の状態を更新
        const book = books.find(b => b.id === bookId);
        if (book) {
            const updatedBook = {
                ...book,
                status: '貸出中',
                borrowed_by: employeeId
            };
            
            const bookResponse = await fetch(`tables/books/${bookId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedBook)
            });
            
            if (!bookResponse.ok) {
                throw new Error('書籍状態の更新に失敗しました');
            }
        }
        
        // フォームリセット
        document.getElementById('rental-form').reset();
        const today = new Date();
        const twoWeeksLater = new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000));
        document.getElementById('rental-due-date').value = twoWeeksLater.toISOString().split('T')[0];
        
        await loadAllData();
        updateRentalSelects();
        displayCurrentRentals();
        showNotification('貸出処理が完了しました', 'success');
        
    } catch (error) {
        console.error('貸出処理エラー:', error);
        showNotification('貸出処理に失敗しました', 'error');
    }
}

// 返却処理
async function processReturn() {
    const bookId = document.getElementById('return-book').value;
    
    if (!bookId) {
        showNotification('返却する書籍を選択してください', 'error');
        return;
    }
    
    try {
        // 現在の貸出履歴を見つけて更新
        const currentRental = rentalHistory.find(r => 
            r.book_id === bookId && r.status === '貸出中'
        );
        
        if (currentRental) {
            const updatedRental = {
                ...currentRental,
                returned_date: Date.now(),
                status: '返却済み'
            };
            
            const rentalResponse = await fetch(`tables/rental_history/${currentRental.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedRental)
            });
            
            if (!rentalResponse.ok) {
                throw new Error('貸出履歴の更新に失敗しました');
            }
        }
        
        // 書籍の状態を更新
        const book = books.find(b => b.id === bookId);
        if (book) {
            const updatedBook = {
                ...book,
                status: '在庫',
                borrowed_by: ''
            };
            
            const bookResponse = await fetch(`tables/books/${bookId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedBook)
            });
            
            if (!bookResponse.ok) {
                throw new Error('書籍状態の更新に失敗しました');
            }
        }
        
        await loadAllData();
        updateRentalSelects();
        displayCurrentRentals();
        showNotification('返却処理が完了しました', 'success');
        
    } catch (error) {
        console.error('返却処理エラー:', error);
        showNotification('返却処理に失敗しました', 'error');
    }
}

// 現在の貸出一覧表示
function displayCurrentRentals() {
    const container = document.getElementById('current-rentals');
    const currentRentals = rentalHistory.filter(r => r.status === '貸出中');
    
    if (currentRentals.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">現在貸出中の書籍はありません</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">書籍名</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">借用者</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">貸出日</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">返却予定日</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状態</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${currentRentals.map(rental => {
                        const book = books.find(b => b.id === rental.book_id);
                        const employee = employees.find(e => e.id === rental.employee_id);
                        const dueDate = new Date(rental.due_date);
                        const isOverdue = dueDate < new Date();
                        
                        return `
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    ${book ? book.title : '不明'}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${employee ? employee.name : '不明'}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${new Date(rental.borrowed_date).toLocaleDateString('ja-JP')}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${dueDate.toLocaleDateString('ja-JP')}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isOverdue ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}">
                                        ${isOverdue ? '延滞' : '貸出中'}
                                    </span>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// =============================================================================
// 履歴管理機能
// =============================================================================

// 履歴表示
function displayHistory() {
    const container = document.getElementById('history-table');
    const filteredHistory = getFilteredHistory();
    
    if (filteredHistory.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">履歴がありません</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">書籍名</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">借用者</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">貸出日</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">返却予定日</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">返却日</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状態</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${filteredHistory.map(rental => {
                        const book = books.find(b => b.id === rental.book_id);
                        const employee = employees.find(e => e.id === rental.employee_id);
                        const dueDate = new Date(rental.due_date);
                        const isOverdue = rental.status === '貸出中' && dueDate < new Date();
                        
                        return `
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    ${book ? book.title : '不明'}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${employee ? employee.name : '不明'}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${new Date(rental.borrowed_date).toLocaleDateString('ja-JP')}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${dueDate.toLocaleDateString('ja-JP')}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${rental.returned_date ? new Date(rental.returned_date).toLocaleDateString('ja-JP') : '-'}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        rental.status === '返却済み' ? 'bg-green-100 text-green-800' :
                                        isOverdue ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                    }">
                                        ${isOverdue ? '延滞' : rental.status}
                                    </span>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// 履歴フィルタリング
function getFilteredHistory() {
    const employeeSearch = document.getElementById('history-employee-search').value.toLowerCase();
    const bookSearch = document.getElementById('history-book-search').value.toLowerCase();
    const statusFilter = document.getElementById('history-status-filter').value;
    const periodFilter = document.getElementById('history-period-filter').value;
    
    return rentalHistory.filter(rental => {
        const book = books.find(b => b.id === rental.book_id);
        const employee = employees.find(e => e.id === rental.employee_id);
        
        const matchesEmployee = !employeeSearch || 
            (employee && employee.name.toLowerCase().includes(employeeSearch));
        
        const matchesBook = !bookSearch || 
            (book && book.title.toLowerCase().includes(bookSearch));
        
        const dueDate = new Date(rental.due_date);
        const isOverdue = rental.status === '貸出中' && dueDate < new Date();
        const actualStatus = isOverdue ? '延滞' : rental.status;
        const matchesStatus = !statusFilter || actualStatus === statusFilter;
        
        let matchesPeriod = true;
        if (periodFilter) {
            const now = new Date();
            const borrowedDate = new Date(rental.borrowed_date);
            
            switch (periodFilter) {
                case 'week':
                    matchesPeriod = (now - borrowedDate) <= (7 * 24 * 60 * 60 * 1000);
                    break;
                case 'month':
                    matchesPeriod = (now - borrowedDate) <= (30 * 24 * 60 * 60 * 1000);
                    break;
                case 'quarter':
                    matchesPeriod = (now - borrowedDate) <= (90 * 24 * 60 * 60 * 1000);
                    break;
            }
        }
        
        return matchesEmployee && matchesBook && matchesStatus && matchesPeriod;
    }).sort((a, b) => b.borrowed_date - a.borrowed_date); // 新しい順
}

function filterHistory() {
    displayHistory();
}

// =============================================================================
// ダッシュボード機能
// =============================================================================

// ダッシュボード更新
function updateDashboard() {
    // 統計の更新
    document.getElementById('total-employees').textContent = employees.filter(e => e.active).length;
    document.getElementById('total-books').textContent = books.length;
    
    const borrowedBooks = books.filter(b => b.status === '貸出中');
    document.getElementById('books-borrowed').textContent = borrowedBooks.length;
    
    const overdueCount = rentalHistory.filter(r => {
        if (r.status !== '貸出中') return false;
        return new Date(r.due_date) < new Date();
    }).length;
    document.getElementById('overdue-books').textContent = overdueCount;
    
    // 最近の貸出表示
    displayRecentRentals();
}

// 最近の貸出表示
function displayRecentRentals() {
    const container = document.getElementById('recent-rentals');
    const recentRentals = rentalHistory
        .sort((a, b) => b.borrowed_date - a.borrowed_date)
        .slice(0, 5);
    
    if (recentRentals.length === 0) {
        container.innerHTML = '<p class="text-gray-500">最近の貸出はありません</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="space-y-3">
            ${recentRentals.map(rental => {
                const book = books.find(b => b.id === rental.book_id);
                const employee = employees.find(e => e.id === rental.employee_id);
                const dueDate = new Date(rental.due_date);
                const isOverdue = rental.status === '貸出中' && dueDate < new Date();
                
                return `
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <p class="text-sm font-medium text-gray-900">
                                ${book ? book.title : '不明'} - ${employee ? employee.name : '不明'}
                            </p>
                            <p class="text-xs text-gray-500">
                                ${new Date(rental.borrowed_date).toLocaleDateString('ja-JP')} 貸出
                            </p>
                        </div>
                        <span class="px-2 py-1 text-xs font-semibold rounded-full ${
                            rental.status === '返却済み' ? 'bg-green-100 text-green-800' :
                            isOverdue ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }">
                            ${isOverdue ? '延滞' : rental.status}
                        </span>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// =============================================================================
// ユーティリティ機能
// =============================================================================

// フィルターオプションの更新
function updateFilterOptions() {
    // 部署フィルター
    const departments = [...new Set(employees.map(e => e.department))].filter(Boolean);
    const departmentSelect = document.getElementById('employee-department-filter');
    departmentSelect.innerHTML = '<option value="">すべて</option>' +
        departments.map(dept => `<option value="${dept}">${dept}</option>`).join('');
    
    // カテゴリフィルター
    const categories = [...new Set(books.map(b => b.category))].filter(Boolean);
    const categorySelect = document.getElementById('book-category-filter');
    categorySelect.innerHTML = '<option value="">すべて</option>' +
        categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

// 通知表示
function showNotification(message, type = 'info') {
    // 通知要素を作成
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 3秒後に自動削除
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}