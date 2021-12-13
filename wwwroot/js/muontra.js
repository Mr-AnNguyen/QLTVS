$(document).ready(function () {
    var Sachs = new SachJS();
    $('#clickrowid tbody').on('click', '.btnEdit', function () {
        var $row = $(this).closest("tr");
        var $text = $row.find(".nr").text();
        $.ajax({
            url: "/api/muontra/get-id/" + $text,
            method: "GET",
            contentType: "application/json",
        }).done(function (res) {
            if (!res) {
                alert("Sách không còn tồn tại");
            }
            else {
                $("#btnsave").text("Trả");
                $(".shows").removeClass("showdetail");
                $(".form-group input").prop("disabled", true);
                Sachs.showDialog();
                $("#MaMuonTra").val(res.maMuonTra);
                $("#MaSach").val(res.maSach);
                $("#MaDocGia").val(res.maDocGia);
                $("#SoLuong").val(res.soLuong);
                $("#TienCoc").val(res.tienCoc);
                $("#TenSach").val(res.tenSach);
                $("#TacGia").val(res.tacGia);
                $("#NhaXB").val(res.nhaXB);
                $("#NamXB").val(res.namXB);
                $("#TenDocGia").val(res.tenDocGia);
                $("#Sdt").val(res.sdt);
                $("#NgayMuon").val(res.ngayMuon);
                $("#MaMuonTra").addClass("edit").prop("readonly", true);
            }
        }).fail(function (res) {
            debugger
        })
    })
})
class SachJS {
    constructor() {
        this.LoadData();
        this.Events();
    }
    LoadData() {
        $.ajax({
            url: "/api/muontra/getmuon-all",
            method: "GET",
            contentType: "application/json",
        }).done(function (response) {
            $('#clickrowid tbody').empty();
            $.each(response, function (index, item) {
                var ymd = item.ngayMuon.split('T');
                var dmy = ymd[0].split('-').reverse().join('-');
                var trHTML = $(`<tr class="row-selected">
                                <th class="nr" scope="row">`+ item.maMuonTra + `</th>
                                <td>`+ item.tenSach + `</td>
                                <td>`+ item.tenDocGia + `</td>
                                <td>`+ item.soLuong + `</td>
                                <td>`+ new Intl.NumberFormat().format(item.tienCoc) + `đ </td>
                                <td>`+ dmy + `</td>
                                <td>
                                    <button class="btnEdit" style="background-color: #00ff21"  title="Xem chi tiết">
                                        <i class="fa fa-eye" aria-hidden="true"></i>Xem
                                    </button>
                                </td>
                            </tr>`);
                $('#clickrowid tbody').append(trHTML);
            })
        }).fail(function (response) {
            debugger;
        })
        $.ajax({
            url: "/api/muontra/gettra-all",
            method: "GET",
            contentType: "application/json",
        }).done(function (response) {
            $('#clickrowid1 tbody').empty();
            $.each(response, function (index, item) {
                var ymdM = item.ngayMuon.split('T');
                var dmyM = ymdM[0].split('-').reverse().join('-');
                var ymd = item.ngayTra.split('T');
                var dmy = ymd[0].split('-').reverse().join('-');
                var trHTML = $(`<tr>
                                <th class="nr" scope="row">`+ item.maMuonTra + `</th>
                                <td>`+ item.tenSach + `</td>
                                <td>`+ item.tenDocGia + `</td>
                                <td>`+ item.soLuong + `</td>
                                <td>`+ new Intl.NumberFormat().format(item.tienCoc) + `đ </td>
                                <td>`+ dmyM + `</td>
                                <td>`+ dmy + `</td>
                                <td>
                                    <button class="btnEdit" style="background-color: #00ff21"  title="Xem chi tiết">
                                        <i class="fa fa-eye" aria-hidden="true"></i>xem
                                    </button>
                                </td>
                            </tr>`);
                $('#clickrowid1 tbody').append(trHTML);
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
        $("#btnsave").text("Mượn");
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
        $("#MaMuonTra").removeClass("edit").prop("readonly", false);
        $(".shows").addClass("showdetail");
        $(".form-group input").prop("disabled", false);
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
        var url = "/api/muontra/muon";
        var alters = "mượn thành công!"
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
            sachs.maMuonTra = $("#MaMuonTra").val();
            sachs.maSach = $("#MaSach").val();
            sachs.maDocGia = $("#MaDocGia").val();
            sachs.soLuong = $("#SoLuong").val();
            sachs.tienCoc = $("#TienCoc").val();
            if ($("#MaMuonTra").hasClass("edit")) {
                var choise = confirm("Bạn có chắc trả sách này?");
                if (choise) {
                    var method = "PUT";
                    var url = "/api/muontra/tra";
                    $("#MaMuonTra").removeClass("edit").prop("readonly", false);
                    alters = "Đã trả thành công!"
                } else {
                    self.hideDialog();
                    alert("đã hủy thao tác!")
                    return;
				}
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
                alert(alters);
            }).fail(function (res) {
                debugger
            })
        }
    }
}


