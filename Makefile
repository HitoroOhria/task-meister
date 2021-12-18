# ex. target name: foo-bar-baz
#     call: $(call getanywordintarget,2)
#     return: bar
getanywordintarget = $(word $1,$(subst -, ,$@))


