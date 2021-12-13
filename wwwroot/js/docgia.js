$(document).ready(function () {
    var DocGias = new DocGiaJS();
    $('#clickrowid tbody').on('click', '.btnEdit', function () {
        var $row = $(this).closest("tr");
        var $text = $row.find(".nr").text();
        $.ajax({
            url: "/api/apidocgia/get-id/" + $text,
            method: "GET",
            contentType: "application/json",
        }).done(function (res) {
            if (!res) {
                alert("Sách không còn tồn tại")
            }
            else {
                var ymdt = res.ngaySinh.split('T')
                DocGias.showDialog();
                $("#MaDocGia").val(res.maDocGia);
                $("#TenDocGia").val(res.tenDocGia);
                $("#DiaChi").val(res.diaChi);
                $("#SDT").val(res.sdt);
                $("#CCCD").val(res.cccd);
                $("#GioiTinh").val(res.gioiTinh);
                $("#NgaySinh").val(ymdt[0]);
                $("#MaDocGia").addClass("edit").prop("readonly", true);
            }
        }).fail(function (res) {
            debugger
        })
    })
    $('#clickrowid tbody').on('click', '.btnDelete', function () {
        var $row = $(this).closest("tr");
        var $text = $row.find(".nr").text();
        var sachDelete = {};
        sachDelete.maDocGia = $text;
        var choise = confirm("Bạn có chắc muốn xóa mục này?");
        if (choise) {
            $.ajax({
                url: "/api/apidocgia/delete",
                method: "POST",
                data: JSON.stringify(sachDelete),
                contentType: "application/json",
                dataType: "json"
            }).done(function (res) {
                // load lại dữ liệu
                DocGias.LoadData();
                alert("Xóa thành công");
            }).fail(function (res) {
                DocGias.LoadData();
                alert("Xóa thành công");
                debugger;
            })
        }
    })
})
class DocGiaJS {
    constructor() {
        this.LoadData();
        this.Events();
    }
    LoadData() {
        $.ajax({
            url: "/api/apidocgia/get-all",
            method: "GET",
            contentType: "application/json",
        }).done(function (response) {
            $('#clickrowid tbody').empty();
            $.each(response, function (index, item) {
                var ymdt = item.ngaySinh.split('T')
                var dmy = ymdt[0].split('-').reverse().join('/');
                var trHTML = $(`<tr class="row-selected">
                                <th class="nr" scope="row">`+ item.maDocGia + `</th>
                                <td>`+ item.tenDocGia + `</td>
                                <td>`+ item.diaChi + `</td>
                                <td>`+ item.sdt + `</td>
                                <td>`+ item.cccd + `</td>
                                <td>`+ item.gioiTinh + `</td>
                                <td>`+ dmy + `</td>
                                <td>
                                    <button class="btnEdit" style="background-color: #00ff21"  title="Sửa">
                                        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                                    </button>
                                    <button class="btnDelete" style="background-color: #ff0000" title="Xóa">
                                        <i class="fa fa-trash-o" aria-hidden="true"></i>
                                    </button>
                                </td>
                            </tr>`);
                $('#clickrowid tbody').append(trHTML);
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
    bntCancel() {
        this.hideDialog();
    }
    showDialog() {
        $('.dialog input').val(null);
        $('.dialog-modal').show();
        $('.dialog').show();
    }
    hideDialog() {
        $('.dialog-modal').hide();
        $('.dialog').hide();
        $("#MaDocGia").removeClass("edit").prop("readonly", false);
    }
    checkRequired() {
        var value = this.value;
        if (!value) {
            $(this).addClass('required-error');
            $(this).attr("placeholder", "Bạn chưa nhập ô này");
        } else {
            $(this).removeClass('required-error');
            $(this).attr("placeholder", "Mã sách");
        }
    }
    btnSaveOnClick() {
        var self = this;
        var method = "POST";
        var url = "/api/apidocgia/create";

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
            var docgias = {};
            docgias.maDocGia = $("#MaDocGia").val();
            docgias.tenDocGia = $("#TenDocGia").val();
            docgias.diaChi = $("#DiaChi").val();
            docgias.sdt = $("#SDT").val();
            docgias.cccd = $("#CCCD").val();
            docgias.gioiTinh = $("#GioiTinh").val();
            docgias.ngaySinh = $("#NgaySinh").val();
            if ($("#MaDocGia").hasClass("edit")) {
                var method = "PUT";
                var url = "/api/apidocgia/update";
                $("#MaDocGia").removeClass("edit").prop("readonly", false);
            }
            $.ajax({
                url: url,
                method: method,
                data: JSON.stringify(docgias),
                contentType: "application/json",
                dataType: "json"
            }).done(function (res) {
                // load lại dữ liệu
                self.LoadData();
                self.hideDialog();
            }).fail(function (res) {
                debugger
            })
        }
    }
}

