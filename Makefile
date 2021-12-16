# ex. target name: foo-bar-baz
#     call: $(call getanywordintarget,2)
#     return: bar
getanywordintarget = $(word $1,$(subst -, ,$@))

# mig-cre-dev-${name}
# ex. mig-cre-dev-create_user
getmigcrename = $(call getanywordintarget,4)
mig-cre-dev-%:
	migrate create -ext sql -dir db/migrations/main -seq $(call getmigcrename)

# mig-dev-${command}
# ex. mig-dev-up
getmigcmd = $(call getanywordintarget,3)
mig-dev-%:
	migrate -path db/migrations/main -database 'mysql://docker:docker@tcp(127.0.0.1:4306)/main' $(call getmigcmd)

