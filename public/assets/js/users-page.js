function UserPage() {
  this.initUserPage();
}

UserPage.prototype.offset = 0;

UserPage.prototype.isPagingRendered = false;

UserPage.prototype.handleDB = function (item) {
  if (MAIN_DB_USER && IS_ONLINE) {
    var user = MAIN_DB_USER.findOne({ username: item.username });

    if (user) {
      Object.keys(item).forEach(key => {
        if (user[key] !== item[key]) {
          user[key] = item[key];
        }
      });

      MAIN_DB_USER.update(user);
    } else {
      MAIN_DB_USER.insert(item);
    }
  }
}

UserPage.prototype.renderRow = function (responses) {
  const context = this;
  $("#table-body-users").empty();

  responses.forEach(function (item, index) {
    item.index = (index + 1) + context.offset;
    context.handleDB(item);

    let {
      username,
      nip,
      jabatan: {
        nama,
        sebutan,
        unit: { nama: namaUnit }
      }
    } = item;

    let param = {
      no: item.index,
      username,
      nip,
      jabatan: nama + " " + sebutan,
      namaUnit
    };

    var tr = document.createElement("tr");
    Object.values(param).forEach(function (item) {
      var td = document.createElement("td");
      td.innerText = item;
      tr.append(td);
    });

    $("#table-body-users").append(tr);
  });
};

UserPage.prototype.loadUser = function () {
  if (IS_ONLINE) {
    ajaxService
      .findUsers({ offset: this.offset, limit: 20 })
      .then(response => {
        this.renderRow(response.data);

        if (!this.isPagingRendered) {
          $('#pagination').removeClass('is-hidden');
          this.renderPaging(response.rows);
        }
      });
  } else if (MAIN_DB_USER && MAIN_DB_USER.data.length) {
    this.renderRow(MAIN_DB_USER.data);
  } else {
    alert('WE DOESNT HAS THE DATA & YOU ARE OFFLINE');
  }
}

UserPage.prototype.renderPaging = function (totalData) {
  var uLWrapper = $("ul#pagination-list");
  var totalPaging = Math.round(totalData / 20);
  const context = this;

  new Array(totalPaging).fill('').forEach((item, index) => {
    uLWrapper.append(
      `<li>
          <a class="pagination-link paging-btn">${index + 1}</a>
      </li>`
    );
  });

  // wait all paging is rendered and attach event
  setTimeout(() => {
    context.isPagingRendered = true;
    $(".paging-btn").on('click', function () {
      context.offset = ((parseInt(this.innerText) - 1) * 20);
      context.loadUser();
    });
  }, 300);
};

UserPage.prototype.initUserPage = function (params) {
  var context = this;
  $(document).ready(function (params) {
    new SW();

    context.loadUser();
  });
}


var usersPage = new UserPage();