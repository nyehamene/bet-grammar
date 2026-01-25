pkg :: @package("github.com/bet/betui")

version  :: @version("0.12.0")
betutil  :: @require("github.com/bet/betutil@v0.10.0")
other_ui :: @require("github.com/other/ui@v10.0.0")

exports :: @export (
	  user.Gender,
	  user.Role,
	  user.Form,
	  user.Table,
	  user.Form,
	  user.Table,
		user.Dashboard,
		user.Login,
)

pkg.require.add_package_from_url("github.com/other/ui@v10.0.0")
pkg.require.add(betuil)
pkg.export.add(exports)
