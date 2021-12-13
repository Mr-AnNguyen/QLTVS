$(document).ready(function () {
    var Sachs = new SachJS();
    $('#clickrowid tbody').on('click', '.btnEdit', function () {
        var $row = $(this).closest("tr");
        var $text = $row.find(".nr").text();
        $.ajax({
            url: "/api/home/get-id/" + $text,
            method: "GET",
            contentType: "application/json",
        }).done(function (res) {
            if (!res) {
                alert("Sách không còn tồn tại")
            }
            else
            {
                Sachs.showDialog();
                $("#MaSach").val(res.maSach);
                $("#MaLoai").val(res.maLoai);
                $("#TenSach").val(res.tenSach);
                $("#TacGia").val(res.tacGia);
                $("#NhaXB").val(res.nhaXB);
                $("#NamXB").val(res.namXB);
                $("#SoLuong").val(res.soLuong);
                $("#Gia").val(res.gia);
                $("#MaSach").addClass("edit").prop("readonly", true);
			}
        }).fail(function (res) {
            debugger
        })
    })
    $('#clickrowid tbody').on('click', '.btnDelete', function () {
        var $row = $(this).closest("tr");
        var $text = $row.find(".nr").text();
        var sachDelete = {};
        sachDelete.maSach = $text;
        var choise = confirm("Bạn có chắc muốn xóa mục này?");
        if (choise) {
            $.ajax({
                url: "/api/home/delete",
                method: "POST",
                data: JSON.stringify(sachDelete),
                contentType: "application/json",
                dataType: "json"
            }).done(function (res) {
                // load lại dữ liệu
                Sachs.LoadData();
                alert("Xóa thành công");
            }).fail(function (res) {
                Sachs.LoadData();
                alert("Xóa thành công");
                debugger;
            })
        }
    })
})
class SachJS {
    constructor() {
        this.LoadData();
        this.Events();
    }
    LoadData() {
        $.ajax({
            url: "/api/home/get-all",
            method: "GET",
            contentType: "application/json",
        }).done(function (response) {
            $('#clickrowid tbody').empty();
            $.each(response, function (index, item) {
                var trHTML = $(`<tr class="row-selected">
                                <th class="nr" scope="row">`+ item.maSach + `</th>
                                <td>`+ item.tenSach + `</td>
                                <td>`+ item.tacGia + `</td>
                                <td>`+ item.tenLoai + `</td>
                                <td>`+ item.nhaXB + `</td>
                                <td>`+ item.namXB + `</td>
                                <td>`+ item.soLuong + `</td>
                                <td>`+ new Intl.NumberFormat().format(item.gia) + `đ </td>
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

        $.ajax({
            url: "/api/apiloai/get-all/",
            method: "GET",
            contentType: "application/json",
        }).done(function (response) {
            $('.dialog-body #MaLoai').empty();
            $.each(response, function (index, item) {
                var trHTML = $(`<option value="` + item.maLoai + `">` + item.tenLoai + `</option>`);
                $('.dialog-body #MaLoai').append(trHTML);
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
        var sachEdit = {};
        sachEdit.maSach = $("#MaSach").val();
        sachEdit.maLoai = $("#MaLoai").val();
        sachEdit.tenSach = $("#TenSach").val();
        sachEdit.tacGia = $("#TacGia").val();
        sachEdit.nhaXB = $("#NhaXB").val();
        sachEdit.namXB = $("#NamXB").val();
        sachEdit.soLuong = $("#SoLuong").val();
        sachEdit.gia = $("#Gia").val();
        $.ajax({
            url: "/api/home/update",
            method: "PUT",
            data: JSON.stringify(sachEdit),
            contentType: "application/json",
            dataType: "json"
        }).done(function (res) {
            // load lại dữ liệu
            Sachs.LoadData();
            Sachs.hideDialog();
        }).fail(function (res) {
            debugger
        });
    }
    changeText() {
        var $row = $(this).closest("tr");
        var $text = $row.find(".nr").text();
        alert($text);
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
        $("#MaSach").removeClass("edit").prop("readonly", false);
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
        var url = "/api/home/create";
        
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
            var sachs = {};
            sachs.maSach = $("#MaSach").val();
            sachs.maLoai = $("#MaLoai").val();
            sachs.tenSach = $("#TenSach").val();
            sachs.tacGia = $("#TacGia").val();
            sachs.nhaXB = $("#NhaXB").val();
            sachs.namXB = $("#NamXB").val();
            sachs.soLuong = $("#SoLuong").val();
            sachs.gia = $("#Gia").val();
            if ($("#MaSach").hasClass("edit")) {
                var method = "PUT";
                var url = "/api/home/update";
                $("#MaSach").removeClass("edit").prop("readonly", false);
			}
            $.ajax({
                url: url,
                method: method,
                data: JSON.stringify(sachs),
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

