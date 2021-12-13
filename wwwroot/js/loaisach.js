$(document).ready(function () {
    var Loais = new LoaiJS();
    $('#clickrowid tbody').on('click', '.btnEdit', function () {
        Loais.showDialog();
        var $row = $(this).closest("tr");
        var $text = $row.find(".nr").text();
        $.ajax({
            url: "/api/apiloai/get-id/" + $text,
            method: "GET",
            contentType: "application/json",
        }).done(function (res) {
            if (!res) {
                alert("Thể loại không còn tồn tại!")
            }
            else {
                $("#MaLoai").val(res.maLoai);
                $("#TenLoai").val(res.tenLoai);
                $("#MaLoai").addClass("edit").prop("readonly", true);
            }
        }).fail(function (res) {
            debugger
        })
    })
    $('#clickrowid tbody').on('click', '.btnDelete', function () {
        var $row = $(this).closest("tr");
        var $text = $row.find(".nr").text();
        var sachDelete = {};
        sachDelete.maLoai = $text;
        var choise = confirm("Bạn có chắc muốn xóa mục này?");
        if (choise) {
            $.ajax({
                url: "/api/apiloai/delete",
                method: "POST",
                data: JSON.stringify(sachDelete),
                contentType: "application/json",
                dataType: "json"
            }).done(function (res) {
                // load lại dữ liệu
                Loais.LoadData();
                alert("Xóa thành công");
            }).fail(function (res) {
                Loais.LoadData();
                alert("Xóa thành công");
                debugger;
            })
        }
    })
})

class LoaiJS {
    constructor() {
        this.LoadData();
        this.Events();
    }
    LoadData() {
        $.ajax({
            url: "/api/apiloai/get-all",
            method: "GET",
            contentType: "application/json",
        }).done(function (response) {
            $('.grid tbody').empty();
            var i = 1;
            $.each(response, function (index, item) {
                var trHTML = $(`<tr>
                                <th scope="row" val="4">`+ i + `</th>
                                <td class="nr">`+ item.tenLoai + `</td>
                                <td>`+ item.tenLoai + `</td>
                                <td>
                                    <button class="btnEdit" style="background-color: #00ff21"  title="Sửa">
                                        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                                    </button>
                                    <button class="btnDelete" style="background-color: #ff0000" title="Xóa">
                                        <i class="fa fa-trash-o" aria-hidden="true"></i>
                                    </button>
                                </td>
                            </tr>`);
                $('.grid tbody').append(trHTML);
                i++
            })
        }).fail(function (response) {
            debugger;
        })
    }
    Events() {
        $('#btnAdd').click(this.bntAdd.bind(this));
        $('#btnCancel').click(this.bntCancel.bind(this));
        $('#btnClose').click(this.bntCancel.bind(this));
        $('#btnsave').click(this.btnSaveOnClick.bind(this));
        $("input[required]").blur(this.checkRequired);
    }
    bntAdd() {
        this.showDialog();
    }
    btnEdit() {
        this.showDialog();
    }
    bntCancel() {
        this.hideDialog();
    }
    showDialog() {
        $('.dialog-modal').show();
        $('.dialog').show();
    }
    hideDialog() {
        $('.dialog-modal').hide();
        $('.dialog').hide();
        $('.dialog input').val(null);
        $("#MaLoai").removeClass("edit").prop("readonly", false);
    }
    checkRequired() {
        var value = this.value;
        if (!value) {
            $(this).addClass('required-error');
            $(this).attr("placeholder", "Bạn chưa nhập ô này");
        } else {
            $(this).removeClass('required-error');
            $(this).attr("placeholder", "Mời Nhập");
        }
    }
    btnSaveOnClick() {

        var self = this;
        var method = "POST";
        var url = "/api/apiloai/create"
        // Validate dữ liệu nhập trên form
        var inputRequireds = $("[required]");
        var isValid = true;
        $.each(inputRequireds, function (index, input) {
            var valid = $(input).trigger("blur");
            if (isValid && valid.hasClass("required-error")) {
                isValid = false;
            }
        })
        if (isValid) {
            // Lấy thông tin tư form
            var loais = {};
            //loais.maLoai = $("#MaLoai").val();
            loais.tenLoai = $("#TenLoai").val();

            if ($("#MaLoai").hasClass("edit")) {
                var method = "PUT";
                var url = "/api/apiloai/update"
                $("#MaLoai").removeClass("edit").prop("readonly", false);
			}
            $.ajax({
                url: url,
                method: method,
                data: JSON.stringify(loais),
                contentType: "application/json",
                dataType: "json"
            }).done(function (res) {
                // load lại dữ liệu
                alert('Thao tác thành công!');
                self.LoadData();
                self.hideDialog();
            }).fail(function (res) {
                debugger
            })
        }
    }
}