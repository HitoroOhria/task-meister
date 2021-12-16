# ex. target name: foo-bar-baz
#     call: $(call getanywordintarget,2)
#     return: bar
getanywordintarget = $(word $1,$(subst -, ,$@))

# migrate-create-dev-${name}
# ex. migrate-create-dev-create_user
getmigratecreatename = $(call getanywordintarget,4)
migrate-create-dev-%:
	migrate create -ext sql -dir db/migrations/main -seq $(call getmigratecreatename)

# migrate-dev-{command}
# ex. migrate-dev-up
getmigratecmd = $(call getanywordintarget,3)
migrate-dev-%:
	migrate -path db/migrations/main -database 'mysql://docker:docker@tcp(127.0.0.1:4306)/main' $(call getmigratecmd)

